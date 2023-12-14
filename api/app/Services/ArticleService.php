<?php

namespace App\Services;

use App\Repositories\ArticleRepositoryInterface;
use App\Repositories\AuthorRepositoryInterface;
use App\Repositories\CategoryRepositoryInterface;
use App\Repositories\SourceRepositoryInterface;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ArticleService
{
    protected $articleRepository, $sourceRepository, $categoryRepository, $authorRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository, SourceRepositoryInterface $sourceRepository, CategoryRepositoryInterface $categoryRepository, AuthorRepositoryInterface $authorRepository)
    {
        $this->articleRepository = $articleRepository;
        $this->sourceRepository = $sourceRepository;
        $this->categoryRepository = $categoryRepository;
        $this->authorRepository = $authorRepository;
    }


    public function getAll($request)
    {

        return $this->articleRepository->getAll($request);
    }

    public function create(array $data)
    {
        return $this->articleRepository->create($data);
    }

    public function updateOrCreate($data)
    {
        return $this->articleRepository->updateOrCreate($data);
    }

    public function getArticlesFromNewsApi($request)
    {

        $newsApi =  $this->sourceRepository->findByName('NewsApi.org');
        $client = new Client();
        $client = new Client(['base_uri' => $newsApi->base_url]);
        $category = null;
        if ($request->has('category')) {

            $category = $this->categoryRepository->updateOrCreate(
                ['name' => $request->category],
                ['name' => $request->category]
            );
        }
        $author = null;
        if ($request->has('author')) {
            $author  = $request->author;
        }

        $params = [
            'category' => $category ? $category->name : 'business',
            'apiKey' => $newsApi->api_key,
            'sortBy' => 'publishedAt',
        ]; 
        
        try{
            // Send the request to NewsAPI
            $response = Http::withUrlParameters($params)->get($newsApi->base_url . 'v2/top-headlines');

            if ($response->failed()) {
                $response->throw();
            }

            Log::info('Fetched the records, now storing to database');

            foreach ($response->json()['articles'] as $article) {

                $data['author'] = Arr::get($article, 'author');
                $data['title'] = Arr::get($article, 'title');
                $data['description'] = Arr::get($article, 'description');
                $data['url'] = Arr::get($article, 'url');

                $author = null;
                if ($article['author']) {
                    $author = $this->authorRepository->updateOrCreate(
                        ['name' => $article['author']],
                        ['name' => $article['author']]
                    );
                }

                $article = $this->updateOrCreate(
                    //['title' => $article['title']],
                    [
                        'source_id' =>  $newsApi->id, // replace with the actual source ID
                        'title' => $article['title'],
                        'description' => $article['description'],
                        'url' => $article['url'],
                        'author_id' => $author ? $author->id : null,
                        'source_id'  => $newsApi->id,
                        'category_id'  =>  $category ? $category->id : null,
                        'published_at' => Carbon::parse($article['publishedAt'])->format('Y-m-d'),
                    ]
                );
            }

            Log::info('Fetched and saved the articles successfully');
        } catch(Exception $e) {
            Log::error($e->getMessage());
        }
    }

    public function fetchArticlesFromNewsApi()
    {
        //----------------------  get the news api object--------------//
        $newsApiSource =  $this->sourceRepository->findByName('NewsApi.org');

        //------------------ hit the external api --------------//
        $decodedContent = $this->sendRequestToExternalApi($newsApiSource,  ['apiKey' => $newsApiSource->api_key], 'v2/top-headlines', 'business');

        if (! $decodedContent) {
            return;
        }

        $category = $this->categoryRepository->findByName('business');
        if (empty($category)) {
            $category = $this->categoryRepository->updateOrCreate(
                ['name' => 'business'],
                ['name' => 'business']
            );
        }

        foreach ($decodedContent['articles'] as $article) {
            $author = null;
            if ($article['author']) {
                $author = $this->authorRepository->updateOrCreate(
                    ['name' => $article['author']],
                    ['name' => $article['author']]
                );
            }

            //----------- send the data to be store in articles---------//
            $categoryId = $category ? $category->id : null;
            $authorId = $author ? $author->id : null;
            $this->createArticle($newsApiSource->id, $article['title'], $article['description'], $article['url'], $authorId, $categoryId, $article['publishedAt']);
        }
    }

    
    public function fetchArticlesFromNewyorkTimeApi()
    {
        $newyorkApiSource =  $this->sourceRepository->findByName('Newyork Times');

        //------------------ hit the external api --------------//
        $decodedContent = $this->sendRequestToExternalApi($newyorkApiSource, ['api-key' => $newyorkApiSource->api_key], 'svc/news/v3/content/nyt/world.json');

        if (! $decodedContent) {
            return;
        }

        foreach ($decodedContent['results'] as $article) {
            // check if category param exist then create the category in our system 
            $category = null;
            if (!empty($article['section'])) {

                $category = $this->categoryRepository->updateOrCreate(
                    ['name' => $article['section']],
                    ['name' => $article['section']]
                );
            }

            $author = null;
            if (!empty($article['byline'])) {
                $authorName = substr($article['byline'], 3);
                $author = $this->authorRepository->updateOrCreate(
                    ['name' => $authorName],
                    ['name' => $authorName]
                );
            }

            //----------- send the data to be store in articles---------//
            $categoryId = $category ? $category->id : null;
            $authorId = $author ? $author->id : null;
            $this->createArticle($newyorkApiSource->id, $article['title'], $article['abstract'], $article['url'], $authorId, $categoryId, $article['published_date']);
        }

        return true;
    }

    public function fetchArticlesFromGuardianApi()
    {
        $guardianApiSource =  $this->sourceRepository->findByName('The Guardian');
        $decodedContent = $this->sendRequestToExternalApi($guardianApiSource, ['api-key' => $guardianApiSource->api_key], 'search');

        if (! $decodedContent) {
            return;
        }

        $articles = $decodedContent['response']['results'];
        foreach ($articles as $article) {
            // check if category param exist then create the category in our system 
            $category = null;
            if (!empty($article['pillarName'])) {

                $category = $this->categoryRepository->updateOrCreate(
                    ['name' => $article['pillarName']],
                    ['name' => $article['pillarName']]
                );
            }

            //-----------send data to be store in articles---------//
            $categoryId = $category ? $category->id : null;
            $this->createArticle($guardianApiSource->id, $article['webTitle'], null, $article['webUrl'], null, $categoryId, $article['webPublicationDate']);
        }
    }

    private function sendRequestToExternalApi($source, $apiKey, $uri, $category = null)
    {

        $params = $apiKey;
        if ($category) {
            $params['category'] = $category;
        }

        try {
            $response = Http::withUrlParameters($params)->get($source->base_url . $uri);

            if ($response->failed()) {
                $response->throw();
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return [];
        }
    }

    private function createArticle($sourceId, $title, $description, $url, $authorId, $categoryId, $publishedAt)
    {
        //----------- prepare and the data to be store in articles---------//
        $this->updateOrCreate(
            [
                'source_id' => $sourceId,
                'title' => $title,
                'description' => $description,
                'url' => $url,
                'author_id' => $authorId,
                'category_id'  => $categoryId,
                'published_at' => Carbon::parse($publishedAt)->format('Y-m-d'),
            ]
        );
    }
}

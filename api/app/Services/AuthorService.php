<?php

namespace App\Services;

use App\Repositories\AuthorRepositoryInterface;

class AuthorService
{
      protected $authorRepository;

      public function __construct(AuthorRepositoryInterface $authorRepository)
      {
            $this->authorRepository = $authorRepository;
      }


      public function getAll()
      {
            return $this->authorRepository->getAll();
      }
}

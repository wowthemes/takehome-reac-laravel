import React from "react";
import { Card, Col, Row } from "antd";
const { Meta } = Card;

function ContentCard({
  title = "Haribo-Rückruf von Kult-Produkt – Süßigkeiten auf gar keinen Fall essen - Merkur.de",
  description = "Haribo-Rückruf von Kult-Produkt – Süßigkeiten auf gar keinen Fall essen - Merkur.de Haribo-Rückruf von Kult-Produkt – Süßigkeiten auf gar keinen Fall essen - Merkur.de Haribo-Rückruf von Kult-Produkt – Süßigkeiten auf gar keinen Fall essen - Merkur.de",
  source = "newsapi",
  category = "business",
  author = "JEFFREY GETTLEMAN",
  url = "google.com",
  published_at = "2023-05-13",
}) {
  return (
    <Card
      hoverable
      title={title && title}
      extra={
        <a href={url} target="_blank" rel="noopener noreferrer">
          Visit
        </a>
      }
    >
      <Meta description={description && description} />
      <br />
      <hr />
      <Row gutter={[20, 24]} justify={"space-between"}>
        <Col>
          <b>Source:</b> {source}
        </Col>
        {category && (
          <Col>
            <b>Category:</b> {category}
          </Col>
        )}
        {author && (
          <Col>
            <b>Author:</b> {author}
          </Col>
        )}
        {published_at && (
          <Col>
            <b>Published Date:</b> {published_at}
          </Col>
        )}
      </Row>
    </Card>
  );
}

export default ContentCard;

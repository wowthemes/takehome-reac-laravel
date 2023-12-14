import { Col, Row } from "antd";
import React, { useContext } from "react";
import Filters from "./Filters";
import Title from "antd/es/typography/Title";
import { GlobalContext } from "../../context/GlobalContext";
import ContentCard from "../../shared/components/ContentCard";
import Loading from "../../shared/components/Loading";

function HomePage() {
  const {
    globalState: {
      sources,
      authors,
      categories,
      articals,
      loadingOverlay,
      prefrences,
    },
    setArticals,
  } = useContext(GlobalContext);
  if (loadingOverlay) {
    return <Loading />;
  }
  return (
    <Row gutter={[20]} className="content-body">
      <Col
        span={24}
        style={{
          position: "sticky",
          top: -10,
          zIndex: 1000,
          height: "fit-content",
        }}
      >
        {
          <Filters
            sources={sources}
            authors={authors}
            categories={categories}
            setArticals={setArticals}
            prefrences={prefrences}
          />
        }{" "}
      </Col>
      <Col span={24}>
        <Row justify={"center"} gutter={[20]}>
          {articals ? (
            articals.map((artical) => (
              <Col style={{ width: "100%", margin: '20px 0' }}>
                <ContentCard {...artical} />
              </Col>
            ))
          ) : (
            <Col>
              <Title level={4}>No results found</Title>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}

export default HomePage;

import { Button, Col, DatePicker, Row, Select, Typography } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchArticals } from "../../api/Articals/articals";
import { modifyArticalData } from "../../shared/helperFunc/utils";
import { toast } from "../../shared/helperFunc/toast";

const { RangePicker } = DatePicker;
const { Title } = Typography;

function Filters({ sources, authors, categories, setArticals, prefrences }) {
  const [showFilters, setShowFilters] = useState(true);
  const [source, setSource] = useState();
  const [category, setCategory] = useState();
  const [author, setAuthor] = useState();
  const [date_to, setDate_to] = useState();
  const [date_from, setDate_from] = useState();

  useEffect(() => {
    if (prefrences) {
      setSource(prefrences.source_id);
      setCategory(prefrences.category_id);
      setAuthor(prefrences.author_id);
      setDate_to(prefrences.date_to);
      setDate_from(prefrences.date_from);
    }
  }, [prefrences]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current >= dayjs().endOf("day");
  };

  const createQueryParams = () => {
    let queryParams = {};
    if (category) {
      queryParams.category_id = category;
    }
    if (source) {
      queryParams.source_id = source;
    }
    if (author) {
      queryParams.author_id = author;
    }
    if (date_from) {
      queryParams.date_from = date_from;
      queryParams.date_to = date_to;
    }
    return queryParams;
  };

  const onChangeDate = (date) => {
    if (date) {
      const [start, end] = date;
      if (date) {
        setDate_from(start.format("YYYY-MM-DD"));
        setDate_to(end.format("YYYY-MM-DD"));
      }
    } else {
      setDate_from(null);
      setDate_to(null);
    }
  };

  const applyFilters = () => {
    let queruParams = createQueryParams();
    fetchArticals(queruParams)
      .then((res) => {
        let resData = res.data.data;
        if (resData.length > 0) {
          let sourceData = sources;
          let categoryData = categories;
          let authorData = authors;
          let updatedData = modifyArticalData({
            resData,
            sourceData,
            categoryData,
            authorData,
          });
          setArticals(updatedData);
        } else {
          setArticals(null);
        }
      })
      .catch((error) => {
        toast(error.error, "error", " Internal Server Error");
      });
  };

  return (
    <Row
      gutter={[10, 20]}
      justify={"center"}
      style={{
        background: "gainsboro",
        paddingBottom: 10,
      }}
    >
      <Col span={24}>
        <Row
          justify={"space-between"}
          style={{ background: "lightgray", cursor: "pointer" }}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {showFilters ? "Hide" : "Show"} Filters
            </Title>
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {showFilters ? <CaretDownOutlined /> : <CaretUpOutlined />}
            </Title>
          </Col>
        </Row>
      </Col>
      {showFilters && (
        <>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 10 }}
            lg={{ span: 6 }}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="Select a source"
              allowClear
              className="filter-btn"
              value={source}
              options={sources}
              onChange={(value) => setSource(value)}
            />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 10 }}
            lg={{ span: 6 }}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="Select a Category"
              allowClear
              className="filter-btn"
              options={categories}
              value={category}
              onChange={(value) => setCategory(value)}
            />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 10 }}
            lg={{ span: 6 }}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="Select an author"
              allowClear
              className="filter-btn"
              options={authors}
              value={author}
              onChange={(value) => setAuthor(value)}
            />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 10 }}
            lg={{ span: 6 }}
            style={{ width: "100%" }}
          >
            <RangePicker
              disabledDate={disabledDate}
              className="filter-btn"
              // value={[moment(date_from), moment(date_to)]}
              onChange={(date) => onChangeDate(date)}
            />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 10 }}
            lg={{ span: 6 }}
            style={{ width: "100%" }}
          >
            <Button
              type="primary"
              className="filter-btn"
              onClick={applyFilters}
            >
              Apply
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
}

export default Filters;

import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

import React, { useContext, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { postPreferences } from "../../api/Preferences/preferences";
import { toast } from "../../shared/helperFunc/toast";
import { GlobalContext } from "../../context/GlobalContext";

const { RangePicker } = DatePicker;

function Preferences() {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const ref = useRef();
  const navigate = useNavigate();
  const {
    globalState: { prefrences, sources, authors, categories },
    setPrefrences,
  } = useContext(GlobalContext);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current >= dayjs().endOf("day");
  };

  useEffect(() => {
    const initialValues = {
      source_id: prefrences?.source_id,
      category_id: prefrences?.category_id,
      author_id: prefrences?.author_id,
      // date: [
      //   moment(prefrences?.date_from, "YYYY-MM-DD"),
      //   moment(prefrences?.date_to, "YYYY-MM-DD"),
      // ],
    };

    form.setFieldsValue(initialValues);
  }, [prefrences]);

  const onFinish = (values) => {
    // setUserLoginInfo(values);
    let date_from = null;
    let date_to = null;

    if (values.date) {
      const [start, end] = values?.date;
      date_from = start.format("YYYY-MM-DD");
      date_to = end.format("YYYY-MM-DD");
    }
    delete values.date;
    values.date_from = date_from;
    values.date_to = date_to;
    postPreferences(values)
      .then((res) => {
        if (res.status === 200) {
          setPrefrences(values);
          toast("Preferece updated Successfully", "success");
        }
      })
      .catch(() => {
        toast("Error while updating Preferences", "error");
      });
  };

  return (
    <div className="form-container">
      <Row gutter={[0, 5]} className="login-form" justify={"center"}>
        <Col>
          <Title level={2}>Preferences</Title>
        </Col>
        <Col span={24}>
          <Form
            name="preferences"
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name="source_id" label="Source">
              <Select
                placeholder="Select a source"
                allowClear
                options={sources}
              />
            </Form.Item>
            <Form.Item name="category_id" label="Category">
              <Select
                placeholder="Select a Category"
                allowClear
                options={categories}
              />
            </Form.Item>
            <Form.Item name="author_id" label="Author">
              <Select
                placeholder="Select an author"
                allowClear
                options={authors}
              />
            </Form.Item>
            <Form.Item name="date" label="Date">
              <RangePicker
                ref={ref}
                style={{ width: "100%" }}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item>
              <Space size={"large"}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button type="primary" danger onClick={() => navigate("/")}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Preferences;

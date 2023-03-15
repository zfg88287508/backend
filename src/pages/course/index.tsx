import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Image,
  Table,
  Typography,
  Input,
  message,
  Space,
  Tabs,
} from "antd";
import { course } from "../../api";
import styles from "./index.module.less";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { TreeDepartment, TreeCategory, PerButton } from "../../compenents";
import type { TabsProps } from "antd";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  created_at: string;
  thumb: string;
  charge: number;
  is_show: number;
}

export const CoursePage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [title, setTitle] = useState<string>("");
  const [dep_ids, setDepIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("全部视频");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `分类`,
      children: (
        <div className="float-left">
          <TreeCategory
            text={"课程"}
            onUpdate={(keys: any, title: any) => {
              setCategoryIds(keys);
              setLabel(title);
            }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: `部门`,
      children: (
        <div className="float-left">
          <TreeDepartment
            text={"部门"}
            onUpdate={(keys: any, title: any) => {
              setDepIds(keys);
              setLabel(title);
            }}
          />
        </div>
      ),
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "课程名称",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            preview={false}
            width={80}
            height={60}
            src={record.thumb}
          ></Image>
          <span className="ml-8">{record.title}</span>
        </div>
      ),
    },
    {
      title: "是否显示",
      dataIndex: "is_show",
      render: (is_show: number) => (
        <span className={is_show === 1 ? "c-green" : "c-red"}>
          {is_show === 1 ? "· 显示" : "· 隐藏"}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <Space size="small">
          <PerButton
            type="link"
            text="编辑"
            class="b-link c-red"
            icon={null}
            p="course"
            onClick={() => navigate(`/course/update/${record.id}`)}
            disabled={null}
          />
          <div className="form-column"></div>
          <PerButton
            type="link"
            text="删除"
            class="b-link c-red"
            icon={null}
            p="course"
            onClick={() => removeItem(record.id)}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  // 删除课程
  const removeItem = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此课程？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        course.destroyCourse(id).then(() => {
          message.success("删除成功");
          resetList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 获取视频列表
  const getList = () => {
    setLoading(true);
    let categoryIds = category_ids.join(",");
    let depIds = dep_ids.join(",");
    course
      .courseList(page, size, "", "", title, depIds, categoryIds)
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setTitle("");
    setRefresh(!refresh);
  };

  // 加载列表
  useEffect(() => {
    getList();
  }, [category_ids, dep_ids, refresh, page, size]);

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>

        <div className="right-box">
          <div className="playedu-main-title float-left mb-24">{selLabel}</div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <Link style={{ textDecoration: "none" }} to={`/course/create`}>
                <PerButton
                  type="primary"
                  text="新建课程"
                  class="mr-16"
                  icon={<PlusOutlined />}
                  p="course"
                  onClick={() => null}
                  disabled={null}
                />
              </Link>
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>课程名称：</Typography.Text>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入名称关键字"
                />
              </div>
              <div className="d-flex">
                <Button className="mr-16" onClick={resetList}>
                  重 置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setPage(1);
                    setRefresh(!refresh);
                  }}
                >
                  查 询
                </Button>
              </div>
            </div>
          </div>
          <div className="float-left">
            <Table
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

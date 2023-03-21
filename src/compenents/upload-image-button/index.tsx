import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Image,
  Empty,
  message,
  Pagination,
} from "antd";
import { resource, resourceCategory } from "../../api";
import styles from "./index.module.less";
import { CreateResourceCategory } from "../create-rs-category";
import { CloseOutlined } from "@ant-design/icons";
import { UploadImageSub } from "./upload-image-sub";
import { TreeCategory } from "../../compenents";

interface Option {
  id: string | number;
  name: string;
  children?: Option[];
}

interface ImageItem {
  id: number;
  category_id: number;
  name: string;
  extension: string;
  size: number;
  disk: string;
  file_id: string;
  path: string;
  url: string;
  created_at: string;
}

interface PropsInterface {
  onSelected: (url: string) => void;
}

export const UploadImageButton = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);
  const [category_ids, setCategoryIds] = useState<any>([]);

  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(15);
  const [total, setTotal] = useState(0);

  // 获取图片列表
  const getImageList = () => {
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "IMAGE", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setImageList(res.data.result.data);
      })
      .catch((err) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetImageList = () => {
    setPage(1);
    setImageList([]);
    setRefresh(!refresh);
  };

  // 加载图片列表
  useEffect(() => {
    getImageList();
  }, [category_ids, refresh, page, size]);

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
      >
        上传图片
      </Button>

      {showModal && (
        <Modal
          title="图片素材库"
          closable={false}
          onCancel={() => {
            setShowModal(false);
          }}
          open={true}
          width={820}
          maskClosable={false}
        >
          <Row style={{ width: 752, minHeight: 520, marginTop: 24 }}>
            <Col span={7}>
              <TreeCategory
                type="no-cate"
                text={"图片"}
                onUpdate={(keys: any) => setCategoryIds(keys)}
              />
            </Col>
            <Col span={17}>
              <Row style={{ marginBottom: 24, paddingLeft: 10 }}>
                <Col span={24}>
                  <UploadImageSub
                    categoryIds={category_ids}
                    onUpdate={() => {
                      resetImageList();
                    }}
                  ></UploadImageSub>
                </Col>
              </Row>
              {imageList.length === 0 && (
                <Col span={24}>
                  <Empty description="暂无图片" />
                </Col>
              )}
              <div className="image-list-box">
                {imageList.map((item) => (
                  <div
                    key={item.id}
                    className="image-item"
                    style={{ backgroundImage: `url(${item.url})` }}
                    onClick={() => {
                      props.onSelected(item.url);
                      setShowModal(false);
                    }}
                  ></div>
                ))}
              </div>
              {imageList.length > 0 && (
                <Col
                  span={24}
                  style={{ display: "flex", flexDirection: "row-reverse" }}
                >
                  <Pagination
                    showSizeChanger
                    onChange={(currentPage, currentSize) => {
                      setPage(currentPage);
                      setSize(currentSize);
                    }}
                    defaultCurrent={page}
                    total={total}
                  />
                </Col>
              )}
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

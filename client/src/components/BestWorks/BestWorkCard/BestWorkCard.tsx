import { Button, Card, Col, Image } from 'antd';
import { BestWorkCardDescription } from './BestWorkCardDescription';
import { IBestWorks } from '../../../pages/best-works';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface IBestWorkCardProps {
  works: IBestWorks[];
  isManageAccess: boolean;
  deleteCardHandler: (id: number) => void;
}

export function BestWorkCard({ works, isManageAccess, deleteCardHandler }: IBestWorkCardProps) {
  return (
    <>
      {works.map(w => (
        <Col xs={24} lg={12} xl={8} xxl={6} key={w.id} style={{ marginBottom: '24px' }}>
          <Card
            cover={<Image alt="project" style={{ border: '1px solid #f0f0f0' }} src={w.imageUrl} />}
            actions={
              isManageAccess
                ? [
                    <Button type="link" shape="circle" icon={<EditOutlined />} key={w.id} />,
                    <Button
                      type="link"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteCardHandler(w.id)}
                    />,
                  ]
                : []
            }
          >
            <BestWorkCardDescription {...w} />
          </Card>
        </Col>
      ))}
    </>
  );
}

import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { BestWorkService } from '../../services/bestWork';
import { CourseService, CourseTask } from '../../services/course';
import { ModalAddBestWork } from './ModalAddBestWork';

interface IAddBestWorkProps {
  course: number;
}

export interface IForm {
  githubId: string[];
  task: number;
  projectUrl: string;
  imageUrl: string;
  tags: string[];
}

export function AddBestWork({ course }: IAddBestWorkProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bestWorkService = useMemo(() => new BestWorkService(), []);
  const [tasks, setTasks] = useState<CourseTask[]>([]);
  const courseService = useMemo(() => new CourseService(course), [course]);

  const [form] = Form.useForm();

  async function getTasks() {
    const courseTasks = await courseService.getCourseTasks('finished');
    setTasks(courseTasks);
  }

  useEffect(() => {
    getTasks();
  }, [course]);

  const onFinish = async (values: IForm) => {
    const result = await bestWorkService.postBestWork({ ...values, course });
    form.resetFields();
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        style={{ position: 'fixed', bottom: '50px', right: '50px' }}
        size={'large'}
        onClick={showModal}
      />
      <ModalAddBestWork
        visible={isModalVisible}
        onFinish={onFinish}
        handleCancel={handleCancel}
        tasks={tasks}
        form={form}
      />
    </>
  );
}

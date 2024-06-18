import { useState } from 'react';
import { Form, Input, Button, Card, Divider } from 'antd';
import './App.css';
import _ from 'lodash';

function App() {
  const [result, setResult] = useState<any>([]);
  const counterBet = (values: any) => {
    const { maxValue, rateHome, rateDraw, rateAway } = values;
    const allBet = [];
    for (let i = 0; i <= maxValue; i++) {
      for (let j = 0; j <= maxValue - i; j++) {
        const homeTake = (rateHome * i * 90) / 100;
        const drawTake = (rateDraw * (maxValue - i - j) * 90) / 100;
        const awayTake = (rateAway * j * 90) / 100;
        if (
          homeTake >= maxValue &&
          drawTake >= maxValue &&
          awayTake >= maxValue
        ) {
          allBet.push({
            bet: [i, maxValue - i - j, j],
            take: [homeTake, drawTake, awayTake],
          });
        }
      }
    }
    setResult(
      _.take(
        _.sortBy(
          allBet?.filter((i) => {
            return i?.bet[0] <= 200 && i?.bet[1] <= 200 && i?.bet[2] <= 200;
          }),
          (i: any) => _.sum(i?.take)
        ),
        10
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title='Counter Bet'>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={counterBet}
          initialValues={{
            maxValue: 200,
            rateHome: 7.3,
            rateDraw: 5.2,
            rateAway: 1.9,
          }}
        >
          <Form.Item label='Số tiền đặt cọc' name='maxValue'>
            <Input />
          </Form.Item>
          <Form.Item label='Tỉ lệ đội nhà Win' name='rateHome'>
            <Input />
          </Form.Item>
          <Form.Item label='Tỉ lệ Hoà' name='rateDraw'>
            <Input />
          </Form.Item>
          <Form.Item label='Tỉ lệ đội khách Win' name='rateAway'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider></Divider>
      <div>
        {result?.map((i: any) => {
          return (
            <Card style={{ marginBottom: 12 }}>
              <div>Đặt kèo [Home, Draw, Away]: {i?.bet?.toString()}</div>
              <div>
                Lấy tiền [Take Home, Take Draw, Take Away]: {i?.take?.toString()}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default App;

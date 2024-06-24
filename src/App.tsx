import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Divider, Radio } from 'antd';
import './App.css';
import _, { round } from 'lodash';

function App() {
  const [result, setResult] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const counterBet = (values: any) => {
    setLoading(true);
    const { maxValue, rateHome, rateDraw, rateAway, suggest } = values;
    const allBet = [];

    for (let i = 0; i <= maxValue; i++) {
      for (let j = 0; j <= maxValue - i; j++) {
        for (let k = 0; k <= maxValue - i - j; k++) {
          const homeTake = (rateHome * i - i) * 0.9;
          const drawTake = (rateDraw * k - k) * 0.9;
          const awayTake = (rateAway * j - j) * 0.9;
          if (homeTake >= j + k && drawTake >= i + j && awayTake >= i + k) {
            allBet.push({
              bet: [i, k, j],
              take: [homeTake, drawTake, awayTake],
              interest: [homeTake - j - k, drawTake - i - j, awayTake - k - i],
            });
          }
        }
      }
    }

    setResult(
      _.take(
        _.reverse(
          _.sortBy(
            _.filter(
              allBet,
              (i) =>
                i?.bet?.[0] <= 200 && i?.bet?.[1] <= 200 && i?.bet?.[2] <= 200
            ),
            (i: any) =>
              suggest === 'none'
                ? _.sum(i?.interest)
                : i?.interest?.[
                    suggest === 'home' ? 0 : suggest === 'draw' ? 1 : 2
                  ]
          )
        ),
        20
      )
    );
    setLoading(false);
  };

  const options = [
    { label: 'None', value: 'none' },
    { label: 'Home', value: 'home' },
    { label: 'Draw', value: 'draw' },
    { label: 'Away', value: 'away' },
  ];

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
            maxValue: 600,
            rateHome: 7.3,
            rateDraw: 5.2,
            rateAway: 1.9,
            suggest: 'home',
          }}
        >
          <Form.Item label='Số tiền đặt cọc' name='maxValue'>
            <Input autoFocus id='input' />
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

          <Form.Item label='Ưu tiên sắp xếp' name='suggest'>
            <Radio.Group options={options} />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type='primary' htmlType='submit'>
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
              <div>
                Vào kèo [Home, Draw, Away]:{' '}
                {`[${i?.bet[0]}, ${i?.bet[1]}, ${i?.bet[2]}]`}
              </div>
              <div>
                Tiền ăn [Home, Draw, Away]:{' '}
                {`[${round(i?.take[0])}, ${round(i?.take[1])}, ${round(
                  i?.take[2]
                )}]`}
              </div>
              <div>
                Thực nhận [Home, Draw, Away]:{' '}
                {`[${round(i?.interest[0])}, ${round(i?.interest[1])}, ${round(
                  i?.interest[2]
                )}]`}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default App;

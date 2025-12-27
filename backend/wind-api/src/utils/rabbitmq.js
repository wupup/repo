import amqplib from 'amqplib';

import { sendMail } from './mailer.js';

let MQConnection = null;
let MQChannel = null;

const QUEUE_NAME = 'task_queue';

async function connectToRabbitMQ() {
  if (MQConnection && MQChannel) return;

  try {
    MQConnection = await amqplib.connect(process.env.RABBITMQ_URL);
    MQChannel = await MQConnection.createChannel();
    await MQChannel.assertQueue(QUEUE_NAME, { durable: true });
  } catch (error) {
    console.error('MQ 连接失败 =>> ', error);
  }
}

function closeRabbitMQ() {
  if (MQConnection) {
    MQConnection.close();
  }
}

async function mailProducer(msgData) {
  try {
    await connectToRabbitMQ();
    const msg = JSON.stringify(msgData);
    MQChannel.sendToQueue(QUEUE_NAME, Buffer.from(msg), { persistent: true });
  } catch (error) {
    console.log('邮件队列生产者错误 =>> ', error);
  }
}

// 实际项目开发通常要可以独立出一个新的服务用来处理消息
async function mailConsumer() {
  try {
    await connectToRabbitMQ();

    MQChannel.consume(
      QUEUE_NAME,
      async msg => {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendMail(message.to, message.subject, message.html);
          // MQChannel.ack(msg);
        } catch (error) {
          // 如果处理失败，可以选择拒绝消息，将消息从队列中删除
          // MQChannel.nack(msg, false, false);
          console.log('消息处理失败 =>> ', error);
        }
        // MQChannel.ack(msg);
      },
      {
        // 是否自动确认消息
        noAck: true,
      },
    );
  } catch (error) {
    console.log('邮件队列消费者错误 =>> ', error);
  }
}

export { mailProducer, mailConsumer };

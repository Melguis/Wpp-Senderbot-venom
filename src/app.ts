import express, { Request, Response } from 'express';
import cors from 'cors';
import Sender from "./sender";

const sender = new Sender;

const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.get("/status", (req: Request, res: Response) => {
  return res.send({
    qr_code: sender.qrCode,
    connected: sender.isConnected,
  })
});

// Send just a message method - Whatsapp & Telegram
app.post("/sendText", async (req: Request, res: Response) => {
  const { numberList, groupList, message } = req.body;

  try {
    const allNumbersList = numberList.concat(groupList);
    console.log(allNumbersList);
    for (let i = 0; i < allNumbersList.length; i++) {
      await sender.sendTextWpp(allNumbersList[i], message);
      await new Promise(f => setTimeout(f, 5000));
    }

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error });
  }
});

// Send image w/ text Method - Whatsapp & Telegram
app.post("/sendImage", async (req: Request, res: Response) => {
  const { numberList, groupList, imgLink, imgName, message } = req.body;

  try {
    const allNumbersList = numberList.concat(groupList);
    // Loop pra enviar mensagens - com delay
    for (let i = 0; i < numberList.length; i++) {
      await sender.sendImageWpp(numberList[i], imgLink, imgName, message);
      await new Promise(f => setTimeout(f, 5000));
    }

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error });
  }
});

app.listen(5000, () => {
  console.log('Server Started!');
})
import { create, Whatsapp, Message, SocketState } from 'venom-bot';
import { Telegraf } from 'telegraf';
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";

export interface QRCode {
  base64Qr: string;
  attempts: number;
}

// Telegram Bot Cretion
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("5622917968:AAF4LbCAZeA2xZOEdC7T_fJsLNrZNVXECw8");

class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QRCode;

  get isConnected(): boolean {
    return this.connected;
  }

  get qrCode(): QRCode {  
    return this.qr;
  }

  constructor() {
    this.initialize();
  }

  async sendTextWpp(to: string, text: string) {

    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error("This number is not valid.");
    }

    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164")?.replace("+", "") as string;

    phoneNumber = `${phoneNumber}@c.us`;
    
    await this.client.sendText(phoneNumber, text);
  }

  async sendImageWpp(to: string, imgLink: string, imgName: string, text: string) {

    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error("This number is not valid.");
    }
    
    // Send imageBase64 and a text to Whatsapp
    let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164")?.replace("+", "") as string;
    phoneNumber = `${phoneNumber}@c.us`;
    await this.client.sendFileFromBase64(phoneNumber, imgLink, imgName, text);
    
    // Remove base64 prefix (Telegram doesn't accept it)
    imgLink = imgLink.replace('data:image/webp;base64,', '');
    imgLink = imgLink.replace('data:image/png;base64,', '');
    // imgLink = imgLink.replace('data:image/jpeg;base64,', '');

    // Send imageBase64 and a text to Telegram
    // await bot.telegram.sendPhoto(-872307469, {source: Buffer.from(imgLink, 'base64')});
    // await bot.telegram.sendMessage(-872307469, text);
    // await bot.telegram.sendPhoto(-868492132, {source: Buffer.from(imgLink, 'base64')});
    // await bot.telegram.sendMessage(-868492132, text);
  }

  private initialize() {
    const start = (client: Whatsapp) => {
      this.client = client;

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED;
      })
    }

    create({session: 'ws-sender-dev', headless: false, debug: true})
      .then((client) => start(client))
      .catch((error) => console.error(error));
  }
}

export default Sender;
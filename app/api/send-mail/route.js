import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,   // таны gmail
                pass: process.env.EMAIL_PASS,   // app password
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "tuguldur8000@gmail.com", // хүлээн авах имэйл энд
            subject: "Шинэ захиалга ирлээ",
            text: `
            Хэрэглэгчийн нэр: ${body.name}
            Утас: ${body.phone}
            Сонгосон үйлчилгээ: ${body.service}
            Талбай: ${body.area} м2
            Давтамж: ${body.frequency}
      `,
        });
        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
}

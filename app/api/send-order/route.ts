import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { items, total } = await req.json();

    const itemRows = items.map((item: any) => 
      `<li>${item.name} - ${Number(item.price).toLocaleString()}₮ (${item.code})</li>`
    ).join('');

    const { data, error } = await resend.emails.send({
      from: 'Order <onboarding@resend.dev>', 
      to: ['tuguldur8000@gmail.com'],
      subject: 'Шинэ захиалга ирлээ!',
      html: `
        <h1>Шинэ захиалгын мэдээлэл</h1>
        <p><strong>Нийт дүн:</strong> ${total.toLocaleString()}₮</p>
        <hr />
        <ul>${itemRows}</ul>
        <p>Захиалга ирсэн цаг: ${new Date().toLocaleString()}</p>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
'use client'

import axios from 'axios';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface DataDisplayProps {
  data: Array<{ [key: string]: string }>;
}

export default function DataDisplay({ data }: DataDisplayProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [template, setTemplate] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const url = 'https://gate.whapi.cloud/messages/text';
  const token = 'NqyvdIicZSA4AN9QF6A7CbNEtnA6n3Cj';

  const handleSendMessage = async () => {
    data.forEach(async (item) => {
      const messageBody = template.replace(/\{(\w+)\}/g, (_, key) => item[key] || '');
      
      const body = {
        to: `${item.number}@s.whatsapp.net`,
        quoted: 'u3yt4enmV6G-th5Jj2by-BOZM',
        ephemeral: 604800,
        edit: 'nLqyJdwTkBH4E7BK22P-EPIZsw-TpQjNb-36_bJroh',
        body: messageBody,
        typing_time: 0,
        no_link_preview: true,
        view_once: true,
      };

      try {
        const response = await axios.post(url, body, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
        });
        console.log(`Message sent to ${item.name}:`, response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`Error sending message to ${item.name}:`, error.message);
          console.error('Response data:', error.response?.data);
        } else {
          console.error(`Unexpected error sending message to ${item.name}:`, error);
        }
      }
    });
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value);
  };

  const handleSaveTemplate = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {Object.keys(data[0]).map((header) => (
              <th key={header} className="py-2 px-4 border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`cursor-pointer ${selectedRow === index ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedRow(index)}
            >
              {Object.values(row).map((value, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border-b">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-x-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Set Template</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Message Template</DialogTitle>
              <DialogDescription>
                Enter your message template here. Use {'{fieldName}'} to insert dynamic content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                id="template"
                value={template}
                onChange={handleTemplateChange}
                placeholder="Hello {name}, your number is {number}."
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveTemplate}>Save template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleSendMessage}
          disabled={!template}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}


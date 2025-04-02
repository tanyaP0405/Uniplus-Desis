import React from "react";
import Container from "../components/ui/Container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide your university email address and create a password.",
    },
    {
      question: "How do I report a lost item?",
      answer: "To report a lost item, navigate to the Lost & Found page, click on 'Report Lost Item', and fill out the form with details about your lost item including when and where you last saw it.",
    },
    {
      question: "How do I list an item for sale?",
      answer: "Go to the Marketplace page and click on 'List an Item'. Fill out the form with details about your item, set a price or enable bidding, and upload clear photos of the item.",
    },
    {
      question: "How do I contact the seller of an item?",
      answer: "On the Marketplace page, find the item you're interested in and click 'Contact Seller'. This will open a form where you can send a message to the seller.",
    },
    {
      question: "How do I claim a found item?",
      answer: "If you see your lost item in the Lost & Found section, click on 'I Own This' and provide information that can verify your ownership of the item.",
    },
    {
      question: "How do I place a bid on an auction item?",
      answer: "On the item's page in the Marketplace, click on 'Place Bid' and enter your bid amount. You'll be notified if you're outbid or if you win the auction.",
    },
    {
      question: "How do I reset my password?",
      answer: "On the login page, click on 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password.",
    },
    {
      question: "How can I contact the UniPlus support team?",
      answer: "You can reach our support team by emailing support@uniplus.com or by using the contact form on the Contact page.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-900 text-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* ✅ Header */}
          <h1 className="text-4xl font-extrabold mb-4 text-center">Help Center</h1>
          <p className="mb-8 text-center text-gray-300">
            Find answers to frequently asked questions about using UniPlus.
          </p>

          {/* ✅ FAQs Section */}
          <div className="bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700">
                  <AccordionTrigger className="text-lg font-semibold text-white py-3 hover:bg-transparent cursor-pointer">
                  <AccordionTrigger className="text-lg font-semibold text-white py-3 hover:bg-transparent cursor-pointer w-full text-left">
                    <span className="underline whitespace-nowrap overflow-hidden text-ellipsis block">
                      {faq.question}
                    </span>
                  </AccordionTrigger>

                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* ✅ Support Section */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
            <p className="mb-6 text-gray-300">
              If you couldn't find the answer to your question, please contact our support team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-700 rounded-lg">
                <h3 className="font-medium mb-2 text-white">Email Support</h3>
                <p className="text-sm mb-3 text-gray-300">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a href="mailto:support@uniplus.com" className="text-blue-400 hover:underline font-medium">
                  support@uniplus.com
                </a>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg">
                <h3 className="font-medium mb-2 text-white">Phone Support</h3>
                <p className="text-sm mb-3 text-gray-300">Available Monday-Friday, 9am-5pm</p>
                <a href="tel:+11234567890" className="text-blue-400 hover:underline font-medium">
                  +1 (123) 456-7890
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpCenter;

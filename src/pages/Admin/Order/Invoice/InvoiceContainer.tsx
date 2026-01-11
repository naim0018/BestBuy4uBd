import { useParams, useSearchParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/store/Api/OrderApi";

import { Button } from "@heroui/react";
import { Printer } from "lucide-react";
import InvoiceTemplate1 from "./Templates/InvoiceTemplate1";
import InvoiceTemplate2 from "./Templates/InvoiceTemplate2";
import InvoiceTemplate3 from "./Templates/InvoiceTemplate3";
import InvoiceTemplate4 from "./Templates/InvoiceTemplate4";

const InvoiceContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template") || "template1";

  const { data: response, isLoading, error } = useGetOrderByIdQuery(id);

  const order = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">Order not found or an error occurred.</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const renderTemplate = () => {
    switch (template.toLowerCase()) {
      case "template2":
        return <InvoiceTemplate2 order={order} />;
      case "template3":
        return <InvoiceTemplate3 order={order} />;
      case "template4":
        return <InvoiceTemplate4 order={order} />;
      case "template1":
      default:
        return <InvoiceTemplate1 order={order} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6 flex justify-end print:hidden">
        <Button
          color="primary"
          onPress={handlePrint}
          startContent={<Printer className="w-4 h-4" />}
        >
          Print / Download PDF
        </Button>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default InvoiceContainer;

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { 
  Settings2, 
  Trash2, 
  BarChart3, 
  Facebook, 
  Plus, 
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetGoogleAnalyticsQuery,
  useCreateGoogleAnalyticsMutation,
  useUpdateGoogleAnalyticsMutation,
  useDeleteGoogleAnalyticsMutation,
  useGetFacebookPixelQuery,
  useCreateFacebookPixelMutation,
  useUpdateFacebookPixelMutation,
  useDeleteFacebookPixelMutation,
} from "@/store/Api/TrackingApi";

const Services = () => {
  // Google Analytics Hooks
  const { data: gaData, isLoading: gaLoading } = useGetGoogleAnalyticsQuery();
  const [createGA, { isLoading: isCreatingGA }] = useCreateGoogleAnalyticsMutation();
  const [updateGA, { isLoading: isUpdatingGA }] = useUpdateGoogleAnalyticsMutation();
  const [deleteGA] = useDeleteGoogleAnalyticsMutation();

  // Facebook Pixel Hooks
  const { data: fbData, isLoading: fbLoading } = useGetFacebookPixelQuery();
  const [createFB, { isLoading: isCreatingFB }] = useCreateFacebookPixelMutation();
  const [updateFB, { isLoading: isUpdatingFB }] = useUpdateFacebookPixelMutation();
  const [deleteFB] = useDeleteFacebookPixelMutation();

  // Modal Control
  const { 
    isOpen: isGAOpen, 
    onOpen: onGAOpen, 
    onClose: onGAClose 
  } = useDisclosure();
  
  const { 
    isOpen: isFBOpen, 
    onOpen: onFBOpen, 
    onClose: onFBClose 
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const [deleteTarget, setDeleteTarget] = useState<"GA" | "FB" | null>(null);

  // Visibility State
  const [showGA, setShowGA] = useState(false);
  const [showFB, setShowFB] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const maskValue = (value: string, show: boolean) => {
    if (!value) return "";
    if (show) return value;
    return value.slice(0, 4) + "••••••••";
  };

  // Forms
  const gaForm = useForm<{ id: string }>();
  const fbForm = useForm<{ pixelId: string; accessToken: string }>();

  // Handlers GA
  const handleGAEdit = () => {
    gaForm.setValue("id", gaData?.data?.googleAnalyticsId || "");
    onGAOpen();
  };

  const onGASubmit = async (data: { id: string }) => {
    try {
      if (gaData?.data) {
        await updateGA(data).unwrap();
        toast.success("Google Analytics updated successfully");
      } else {
        await createGA(data).unwrap();
        toast.success("Google Analytics setup successfully");
      }
      onGAClose();
    } catch {
      toast.error("Failed to save Google Analytics settings");
    }
  };

  // Handlers FB
  const handleFBEdit = () => {
    fbForm.setValue("pixelId", fbData?.data?.pixelId || "");
    fbForm.setValue("accessToken", fbData?.data?.accessToken || "");
    onFBOpen();
  };

  const onFBSubmit = async (data: { pixelId: string; accessToken: string }) => {
    try {
      if (fbData?.data) {
        await updateFB(data).unwrap();
        toast.success("Facebook Pixel updated successfully");
      } else {
        await createFB(data).unwrap();
        toast.success("Facebook Pixel setup successfully");
      }
      onFBClose();
    } catch {
      toast.error("Failed to save Facebook Pixel settings");
    }
  };

  // Delete Handlers
  const confirmDelete = (type: "GA" | "FB") => {
    setDeleteTarget(type);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget === "GA") {
        await deleteGA().unwrap();
        toast.success("Google Analytics disconnected");
      } else if (deleteTarget === "FB") {
        await deleteFB().unwrap();
        toast.success("Facebook Pixel disconnected");
      }
      onDeleteClose();
    } catch {
      toast.error("Deletetion failed");
    }
  };

  if (gaLoading || fbLoading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">External Services</h1>
        <p className="text-gray-500 mt-2">Manage tracking and analytics integrations for your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Google Analytics Card */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex gap-3 p-5">
            <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="text-orange-600 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Google Analytics 4</p>
              <p className="text-xs text-gray-500">Track website traffic and user behavior</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            {gaData?.data?.googleAnalyticsId ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 flex justify-between items-center group">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Measurement ID</span>
                    <span className="font-mono text-gray-700">{maskValue(gaData.data.googleAnalyticsId, showGA)}</span>
                  </div>
                  <Button 
                    isIconOnly 
                    size="sm" 
                    variant="light" 
                    onPress={() => setShowGA(!showGA)}
                  >
                    {showGA ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="flat" 
                    className="flex-1"
                    startContent={<Settings2 size={18} />}
                    onPress={handleGAEdit}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="flat" 
                    color="danger"
                    startContent={<Trash2 size={18} />}
                    onPress={() => confirmDelete("GA")}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-4">
                <p className="text-sm text-gray-500 italic">Google Analytics is not configured yet.</p>
                <Button 
                  color="primary" 
                  className="w-full"
                  startContent={<Plus size={18} />}
                  onPress={() => {
                      gaForm.reset();
                      onGAOpen();
                  }}
                >
                  Setup GA4
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Facebook Pixel Card */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex gap-3 p-5">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Facebook className="text-blue-600 w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Facebook Pixel & CAPI</p>
              <p className="text-xs text-gray-500">Facebook Advertising and Conversions API</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            {fbData?.data?.pixelId ? (
              <div className="space-y-4">
                <div className="space-y-2">
                    <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200 flex justify-between items-center">
                        <div>
                            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Pixel ID</span>
                            <span className="font-mono text-gray-700">{maskValue(fbData.data.pixelId, showFB)}</span>
                        </div>
                        <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            onPress={() => setShowFB(!showFB)}
                        >
                            {showFB ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                    </div>
                </div>
                
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs uppercase font-bold text-blue-600">Conversions API</span>
                            {fbData.data.accessToken ? (
                                <span className="text-[10px] bg-green-500 text-white px-1.5 rounded-full uppercase font-bold">Enabled</span>
                            ) : (
                                 <span className="text-[10px] bg-gray-400 text-white px-1.5 rounded-full uppercase font-bold">Disabled</span>
                            )}
                        </div>
                        <p className="text-[10px] text-blue-800 line-clamp-1 opacity-60 font-mono">
                            {fbData.data.accessToken ? maskValue(fbData.data.accessToken, showToken) : "No access token provided"}
                        </p>
                    </div>
                    {fbData.data.accessToken && (
                        <Button 
                            isIconOnly 
                            size="sm" 
                            variant="light" 
                            className="text-blue-600"
                            onPress={() => setShowToken(!showToken)}
                        >
                            {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                    )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="flat" 
                    className="flex-1"
                    startContent={<Settings2 size={18} />}
                    onPress={handleFBEdit}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="flat" 
                    color="danger"
                    startContent={<Trash2 size={18} />}
                    onPress={() => confirmDelete("FB")}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-4">
                <p className="text-sm text-gray-500 italic">Facebook Pixel is not configured yet.</p>
                <Button 
                  color="primary" 
                  className="w-full bg-blue-600"
                  startContent={<Plus size={18} />}
                  onPress={() => {
                      fbForm.reset();
                      onFBOpen();
                  }}
                >
                  Setup Pixel
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                    <BarChart3 size={18} /> Google Analytics 4
                </h3>
                <p className="text-sm text-orange-700 mb-4">
                    GA4 is the latest version of Google Analytics. You'll need a Measurement ID (usually starts with G-).
                </p>
                <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1 text-orange-600 font-bold hover:underline"
                >
                    Get your ID <ExternalLink size={12} />
                </a>
           </div>

           <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                    <Facebook size={18} /> Conversions API (CAPI)
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                    Improve tracking accuracy by sending events directly from your server. Recommended for accurate ROAS.
                </p>
                <a 
                    href="https://business.facebook.com/events_manager2/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:underline"
                >
                    Setup API <ExternalLink size={12} />
                </a>
           </div>
      </div>

      {/* GA Modal */}
      <Modal isOpen={isGAOpen} onClose={onGAClose}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={gaForm.handleSubmit(onGASubmit)}>
                <ModalHeader className="flex flex-col gap-1">Google Analytics Setup</ModalHeader>
                <ModalBody>
                <Input
                    label="Measurement ID"
                    placeholder="G-XXXXXXXXXX"
                    variant="bordered"
                    {...gaForm.register("id", { required: true })}
                />
                <p className="text-[10px] text-gray-500 p-1">
                    Found in Data Streams &gt; [Your Stream] in Google Analytics Admin.
                </p>
                </ModalBody>
                <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                <Button color="primary" type="submit" isLoading={isCreatingGA || isUpdatingGA}>Save Config</Button>
                </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* FB Modal */}
      <Modal isOpen={isFBOpen} onClose={onFBClose} size="xl">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={fbForm.handleSubmit(onFBSubmit)}>
                <ModalHeader className="flex flex-col gap-1">Facebook Marketing Setup</ModalHeader>
                <ModalBody className="space-y-4">
                <Input
                    label="Pixel ID"
                    placeholder="1234567890"
                    variant="bordered"
                    {...fbForm.register("pixelId", { required: true })}
                />
                <Input
                    label="API Access Token (Optional)"
                    placeholder="EAAG...."
                    variant="bordered"
                    {...fbForm.register("accessToken")}
                />
                <p className="text-[10px] text-gray-500 p-1">
                    Enter your Pixel ID for browser tracking. Add an Access Token if you want to enable the Conversions API for more reliable tracking.
                </p>
                </ModalBody>
                <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                <Button color="primary" type="submit" isLoading={isCreatingFB || isUpdatingFB}>Save Config</Button>
                </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          {(onClose) => (
            <>
                <ModalHeader className="flex items-center gap-2 text-danger">
                    <AlertTriangle className="w-5 h-5" /> Confirm Disconnect
                </ModalHeader>
                <ModalBody>
                    <p className="text-gray-600">
                    Are you sure you want to remove the tracking ID for 
                    <span className="font-bold"> {deleteTarget === "GA" ? "Google Analytics" : "Facebook Pixel"}</span>?
                    </p>
                    <p className="text-xs text-danger mt-2">
                        This will immediately stop all website tracking events for this service.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Keep it</Button>
                    <Button color="danger" onPress={handleDelete}>Yes, Disconnect</Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Services;

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Edit2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
  IBanner,
} from "@/store/Api/BannerApi";

const CMS = () => {
  const { data: bannerResponse } = useGetAllBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Partial<IBanner>>();

  const banners = bannerResponse?.data || [];

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setValue("title", banner.title);
    setValue("description", banner.description);
    setValue("type", banner.type);
    setValue("image", banner.image);
    setValue("productId", banner.productId);
    setValue("isActive", banner.isActive);
    onOpen();
  };

  const handleAdd = () => {
    setEditingBanner(null);
    reset();
    onOpen();
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(data).unwrap();
        toast.success("Banner created successfully");
      }
      onClose();
      reset();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id).unwrap();
        toast.success("Banner deleted successfully");
      } catch {
        toast.error("Failed to delete banner");
      }
    }
  };

  return (
    <div className="p-2 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">CMS</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">Manage banners and site content</p>
        </div>
        <Button
          color="primary"
          size="sm"
          endContent={<Plus className="w-4 h-4" />}
          onPress={handleAdd}
        >
          Add
        </Button>
      </div>

      <div className="hidden lg:block">
        <Card>
          <CardBody>
            <Table aria-label="Banner table">
              <TableHeader>
                <TableColumn>IMAGE</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No banners found"}>
                {banners.map((banner: IBanner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                          {banner.image ? (
                              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon size={20} />
                              </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                          <p className="font-semibold">{banner.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{banner.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color={banner.type === 'hero' ? 'primary' : 'default'}>
                          {banner.type.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={banner.isActive ? "success" : "danger"} variant="dot">
                          {banner.isActive ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                          <Tooltip content="Edit">
                              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(banner)}>
                                  <Edit2 size={18} />
                              </span>
                          </Tooltip>
                          <Tooltip color="danger" content="Delete">
                              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(banner._id)}>
                                  <Trash2 size={18} />
                              </span>
                          </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-3">
        {banners.map((banner: IBanner) => (
          <Card key={banner._id} className="border-none shadow-sm">
            <CardBody className="p-3">
              <div className="flex gap-3">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm truncate">{banner.title}</h3>
                    <Chip size="sm" color={banner.isActive ? "success" : "danger"} variant="flat" className="text-[10px] h-5 min-w-fit">
                      {banner.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{banner.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Chip size="sm" variant="flat" color={banner.type === 'hero' ? 'primary' : 'default'} className="text-[10px] h-5">
                      {banner.type.toUpperCase()}
                    </Chip>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-50">
                <Button 
                  size="sm" 
                  variant="flat" 
                  className="font-bold h-8 text-xs" 
                  startContent={<Edit2 size={14} />}
                  onPress={() => handleEdit(banner)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="danger" 
                  className="font-bold h-8 text-xs" 
                  startContent={<Trash2 size={14} />}
                  onPress={() => handleDelete(banner._id)}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            No banners found
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                    {editingBanner ? "Edit Banner" : "Create New Banner"}
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <Input 
                                label="Title" 
                                placeholder="Enter banner title" 
                                {...register("title", { required: true })} 
                             />
                        </div>
                        <div className="col-span-2">
                             <Input 
                                label="Description" 
                                placeholder="Enter banner description" 
                                {...register("description")} 
                             />
                        </div>
                        <div>
                            <Select 
                                label="Type" 
                                placeholder="Select banner type"
                                {...register("type", { required: true })}
                            >
                                <SelectItem key="hero">Hero Slider</SelectItem>
                                <SelectItem key="product">Product Card</SelectItem>
                            </Select>
                        </div>
                        <div>
                             <Input 
                                label="Product ID" 
                                placeholder="Linked Product ID" 
                                {...register("productId", { required: true })} 
                             />
                        </div>
                        <div className="col-span-2">
                             <Input 
                                label="Image URL" 
                                placeholder="https://..." 
                                {...register("image", { required: true })} 
                             />
                        </div>
                        <div className="col-span-2">
                             <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" {...register("isActive")} defaultChecked />
                                Is Active
                             </label>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" type="submit" isLoading={isCreating || isUpdating}>
                        {editingBanner ? "Update" : "Create"}
                    </Button>
                </ModalFooter>
            </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CMS;

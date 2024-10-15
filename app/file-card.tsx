import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"  

import { Doc } from "@/convex/_generated/dataModel";
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TrashIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
  
function FileCardActions({ file }: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile);
    const { toast } = useToast();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return(
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={ async () =>{

                            await deleteFile({
                                fileId: file._id,
                            });
                            toast({
                                variant: "default",
                                title: "File Deleted",
                                description: "Now the File is gone from the system"
                              })

                        }}
                        >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
        </AlertDialog>
      

        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem 
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-600 items-center cursor-pointer">
                        <TrashIcon className="w-4 h-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
    </>
    );
}


export function FileCard({file}: {file: Doc<"files">}){
    const fileId = file.fileId;
    const filelink = useQuery(api.files.getFileUrl,{ fileId });
    

    const typeIcons = {
        'image': <ImageIcon />,
        'pdf': <FileTextIcon />,
        'csv': <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    return(
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {
                    file.type === 'image' && filelink && 
                    <Image 
                        alt={file.name}
                        width="100"
                        height="100"
                        src={filelink}
                    />
                }
                {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
                {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => window.open(filelink, "_blank")
                }>Download</Button>
            </CardFooter>
        </Card>

    );
}
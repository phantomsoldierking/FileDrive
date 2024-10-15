'use client'

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return(
    <main className="container mx-auto pt-12">


        {files === undefined && 
          <div className="flex flex-col gap-8 w-full items-center mt-32">
            <Loader2 className="h-24 w-24 animate-spin" />
            <div className="text-2xl">Loading...</div>
          </div>
        }


        {files && files?.length === 0 && (
          <div className="flex flex-col gap-8 w-full items-center mt-16">
          <Image 
          alt="image of empty directory"
          width="400"
          height="400"
          src="/empty.svg"
        />
        <div className="text-3xl pt-12">You Have No Files, Upload Now</div>
        <UploadButton />
        </div>
        )} 

        {files && files.length > 0 && (
          <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>
            <div className="grid grid-cols-3 gap-4">
              {files?.map((file) => {
                return <FileCard key={file._id} file={file} />;
              })}
            </div>
        </>
        )}

        
    </main>
  );
}
import { FC } from "react";
import { Button } from "../Button";
import { X } from "lucide-react";

interface DeletePostModalProps {
  setModal: Function;
}

const DeletePostModal: FC<DeletePostModalProps> = ({ setModal }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-10 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <Button
              variant="subtle"
              className="h-6 w-6 p-0 rounded-md"
              aria-label="close modal"
              onClick={() => setModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col text-xl items-center justify-center py-2 text-center">
            <h3>Delete this Post?</h3>
            <p className="text-sm justify-center pt-4 text-center">
              Deleted posts will be permanently removed and will not be archived
            </p>
            <div className="mt-3 flex">
              <Button
                className="mr-2"
                onClick={() => setModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button>Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;

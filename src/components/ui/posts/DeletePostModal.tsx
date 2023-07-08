import CloseModal from "../CloseModal";
import { FC } from "react";
import { Button } from "../Button";
import { X } from "lucide-react";

interface DeletePostModalProps {
  modal: boolean;
  setModal: Function;
}

const DeletePostModal: FC<DeletePostModalProps> = ({ modal, setModal }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
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
          <div>Are you sure?</div>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;

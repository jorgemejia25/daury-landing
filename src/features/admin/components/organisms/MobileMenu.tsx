"use client";

import { Dialog, DialogTrigger } from "@ui-sdk/react/dialog";
import { Menu } from "lucide-react";
import { iconButtonClass } from "@/ui/atoms/IconButton";
import { Modal } from "@/ui/organisms/Modal";
import type { AdminUser } from "@/features/admin/lib/access";
import { BrandLink } from "@/features/admin/components/molecules/BrandLink";
import { AdminNav } from "./AdminNav";
import { SessionPanel } from "./SessionPanel";
import styles from "./MobileMenu.styles";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  logout: () => Promise<void>;
};

/** Panel lateral de navegación para pantallas pequeñas. */
export function MobileMenu({ open, onOpenChange, user, logout }: MobileMenuProps) {
  const close = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={`${iconButtonClass} ${styles.toggle}`} data-variant="soft" aria-label="Abrir navegación">
        <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
      </DialogTrigger>
      <Modal
        placement="side"
        title="Navegación móvil"
        hideTitle
        closeLabel="Cerrar navegación"
        heading={<BrandLink onNavigate={close} />}
        keepMounted
        initialFocus="content"
      >
        <AdminNav label="Secciones del admin" onNavigate={close} />
        <SessionPanel user={user} logout={logout} onNavigate={close} />
      </Modal>
    </Dialog>
  );
}

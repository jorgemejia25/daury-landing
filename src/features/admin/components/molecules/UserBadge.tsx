import { Avatar } from "@/ui/atoms/Avatar";
import type { AdminUser } from "@/features/admin/lib/access";
import styles from "./UserBadge.styles";

/** Persona con sesión iniciada: avatar con iniciales, nombre y correo. */
export function UserBadge({ user }: { user: AdminUser }) {
  return (
    <div className={styles.badge}>
      <Avatar name={user.name} tone="violet" size={32} />
      <span className={styles.text}>
        <strong>{user.name}</strong>
        <small>{user.email}</small>
      </span>
    </div>
  );
}

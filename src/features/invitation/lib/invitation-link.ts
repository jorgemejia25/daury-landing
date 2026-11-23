/** The invitation credential is transported in the fragment and read only by the browser. */
export function invitationAppLink(fragment: string | null): { code: string; href: string } | null {
  const values = new URLSearchParams(fragment?.slice(1)).getAll("code");
  const code = values[0];
  if (values.length !== 1 || !/^[A-HJ-NP-Z2-9]{32}$/.test(code)) return null;
  return { code, href: `daury:///join?code=${code}` };
}

/** Map API patient/doctor/answerer shapes to props expected by AvatarIcon. */
export function avatarUserFromAuthor(author) {
  if (!author || typeof author !== "object") return null;
  const fullName = String(
    author.fullName ??
      author.FullName ??
      [author.firstName, author.lastName].filter(Boolean).join(" ") ??
      "",
  ).trim();
  const parts = fullName ? fullName.split(/\s+/) : [];
  const firstName =
    author.firstName ??
    author.FirstName ??
    (parts[0] ?? "");
  const lastName =
    author.lastName ??
    author.LastName ??
    (parts.length > 1 ? parts.slice(1).join(" ") : "");
  const imageUrl =
    author.imageUrl ??
    author.ImageUrl ??
    author.profileImageUrl ??
    author.ProfileImageUrl ??
    author.imageUrl1 ??
    author.ImageUrl1 ??
    author.avatarUrl ??
    author.AvatarUrl ??
    author.profilePictureUrl ??
    author.ProfilePictureUrl ??
    "";
  return {
    firstName,
    lastName,
    imageUrl,
    profileImageUrl: imageUrl,
    imageUrl1: author.imageUrl1 ?? author.ImageUrl1,
  };
}

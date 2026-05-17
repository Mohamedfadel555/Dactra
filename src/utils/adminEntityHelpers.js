const API_ORIGIN = "https://dactra.runasp.net";

/** Turn relative upload paths into absolute URLs */
export function resolveMediaUrl(url) {
  if (url == null || url === "") return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_ORIGIN}${path}`;
}

/** Profile image URL from admin list / profile API shapes */
export function pickAdminImageUrl(entity) {
  if (!entity) return null;
  const raw =
    entity.imageUrl ??
    entity.ImageUrl ??
    entity.profileImageUrl ??
    entity.ProfileImageUrl ??
    entity.imageUrl1 ??
    entity.ImageUrl1 ??
    entity.profilePictureUrl ??
    entity.ProfilePictureUrl ??
    entity.doctorImageUrl ??
    entity.DoctorImageUrl ??
    entity.patientImageUrl ??
    entity.PatientImageUrl ??
    entity.logoUrl ??
    entity.LogoUrl ??
    entity.avatarUrl ??
    entity.AvatarUrl ??
    entity.image ??
    entity.Image ??
    entity.imgUrl ??
    entity.ImgUrl ??
    entity.photo ??
    entity.Photo ??
    entity.user?.imageUrl ??
    entity.user?.profileImageUrl ??
    null;
  return resolveMediaUrl(raw);
}

export function getAdminProfileId(entity) {
  if (!entity) return null;
  return (
    entity.profileId ??
    entity.ProfileId ??
    entity.id ??
    entity.Id ??
    null
  );
}

/** Fetch profile when admin list omits image fields */
export async function enrichWithProfileImages(
  items,
  fetchProfile,
  getProfileId = getAdminProfileId,
) {
  if (!Array.isArray(items) || !fetchProfile) return items ?? [];
  const chunkSize = 8;
  const result = [...items];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const enriched = await Promise.all(
      chunk.map(async (item) => {
        if (pickAdminImageUrl(item)) return item;
        const id = getProfileId(item);
        if (id == null) return item;
        try {
          const profile = await fetchProfile(id);
          const merged = profile?.data ?? profile;
          return merged ? { ...item, ...merged } : item;
        } catch {
          return item;
        }
      }),
    );
    for (let j = 0; j < enriched.length; j++) {
      result[i + j] = enriched[j];
    }
  }

  return result;
}

export function getAdminDisplayName(entity) {
  if (!entity) return "";
  return (
    entity.fullName ??
    entity.FullName ??
    entity.name ??
    entity.Name ??
    ""
  );
}

export async function getBannerImage(appId: number): Promise<string> {
  // Steam has built-in caching for this, so we don't have to worry about making useless requests or needing to cache it ourselves
  await StoreItemCache.QueueAppRequest(appId, { include_assets: true });

  return StoreItemCache.GetApp(appId)?.m_Assets?.m_strSmallCapsuleURL ?? `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/capsule_184x69.jpg`;
}

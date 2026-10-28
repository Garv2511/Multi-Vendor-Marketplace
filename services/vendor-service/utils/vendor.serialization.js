const serializeVendorPublic = (vendor) => {
    const source = vendor?.toObject ? vendor.toObject() : vendor;
    if (!source) return null;

    return {
        userId: source.userId,
        email: source.email,
        storeName: source.storeName,
        slug: source.slug,
        status: source.status,
        uuid: source.uuid,
        createdAt: source.createdAt,
        updatedAt: source.updatedAt
    };
};

export { serializeVendorPublic };

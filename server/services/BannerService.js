import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, uploadToS3 } from "../config/s3Service.js";
import Banner from "../models/admin/Banner.js";
import { ErrorFactory } from "../utils/errors.js";


class BannerService {
  static async addBanner({ body, file }) {
    const {
      title,
      subtitle,
      type,
      page,
      section,
      sliderId,
      redirectType,
      redirectValue,
      discountText,
      isActive,
      isVisible,
      order,
      startDate,
      endDate,
    } = body;

    if (!file) {
      throw ErrorFactory.notFound("Image is required");
    }
  const imageUrl = await uploadToS3(file);


    const banner = new Banner({
      title,
      subtitle,
      type,
      page,
      section,
      sliderId,
      redirectType,
      redirectValue,
      discountText,
      isActive: isActive ?? true,
      isVisible: isVisible ?? true,
      order: order ?? 0,
      startDate,
      endDate,
      image: imageUrl,
    });

    await banner.save();
    return banner;
  }

  static async getBannersUser({ page, section }) {
    const filter = {
      isActive: true,
      isVisible: true,
    };

    if (page) filter.page = page;
    if (section) filter.section = section;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    return banners;
  }


  static async getBanners({ page = 1, limit = 10, pageType, section }) {
  const filter = {
    isActive: true,
    isVisible: true,
  };


  if (pageType) filter.page = pageType;


  if (section) filter.section = section;

  const skip = (page - 1) * limit;

  const [banners, totalBanners] = await Promise.all([
    Banner.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Banner.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalBanners / limit);

  return {
    data: banners,
    totalPages,
    currentPage: page,
    totalBanners,
  };
}


static async updateBanner({ id, body, file }) {

  const banner = await Banner.findById(id);
  if (!banner) throw new Error("Banner not found");

  let imageUrl = banner.image;

  if (file) {

   
    const oldKey = decodeURIComponent(
      new URL(banner.image).pathname.substring(1)
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: oldKey,
      })
    );

   
    imageUrl = await uploadToS3(file);
  }

  Object.assign(banner, {
    title: body.title ?? banner.title,
    subtitle: body.subtitle ?? banner.subtitle,
    type: body.type ?? banner.type,
    page: body.page ?? banner.page,
    section: body.section ?? banner.section,
    sliderId: body.sliderId ?? banner.sliderId,
    redirectType: body.redirectType ?? banner.redirectType,
    redirectValue: body.redirectValue ?? banner.redirectValue,
    discountText: body.discountText ?? banner.discountText,
    isActive: body.isActive ?? banner.isActive,
    isVisible: body.isVisible ?? banner.isVisible,
    order: body.order ?? banner.order,
    startDate: body.startDate ?? banner.startDate,
    endDate: body.endDate ?? banner.endDate,
    image: imageUrl,
  });

  await banner.save();
  return banner;
}
  
static async deleteBanner(id) {

  const banner = await Banner.findById(id);
  if (!banner) throw new Error("Banner not found");


  const key = decodeURIComponent(
    new URL(banner.image).pathname.substring(1)
  );

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    })
  );

  await Banner.findByIdAndDelete(id);

  return { message: "Banner deleted successfully" };
}
  static async getBannerById(id) {
    const banner = await Banner.findById(id);
    if (!banner) throw new Error("Banner not found");
    return banner;
  }
}

export default BannerService;

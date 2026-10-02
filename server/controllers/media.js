const helpers = require('../helpers.js');
const db = require('../db.js');

const api = {
  async getMedia(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      limit: pageSize,
      offset,
    };

    try {
      const [rows, countResult] = await Promise.all([
        db.any(req, 'select * from media order by created_at desc limit $/limit/ offset $/offset/', qObj),
        db.one(req, 'select count(*) as total from media', qObj),
      ]);
      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('media.getMedia(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get media files.');
    }
  },

  async uploadMedia(req, res) {
    const file = req.file;
    if (!file) {
      req.log.warn('media.uploadMedia(): Missing file in request');
      return res.status(400).json({ success: false, msg: 'File is required' });
    }

    const qObj = {
      filename: file.filename || file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url: `/uploads/${file.filename || file.originalname}`,
      altText: req.body?.altText || file.originalname,
    };

    try {
      const media = await db.one(
        req,
        `insert into media (filename, original_name, mime_type, size_bytes, url, alt_text)
         values ($/filename/, $/originalName/, $/mimeType/, $/sizeBytes/, $/url/, $/altText/)
         returning *`,
        qObj,
      );

      req.log.info('media.uploadMedia(): Media uploaded', { mediaId: media.id, filename: media.filename });
      return res.status(201).json({ success: true, msg: 'Media uploaded successfully', data: { media } });
    } catch (error) {
      req.log.error('media.uploadMedia(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to upload media.');
    }
  },

  async deleteMedia(req, res) {
    const qObj = {
      id: req.params?.id,
    };

    try {
      await db.none(req, 'delete from media where id = $/id/', qObj);
      req.log.info('media.deleteMedia(): Media deleted', qObj);
      return res.status(200).json({ success: true, msg: 'Media deleted successfully' });
    } catch (error) {
      req.log.error('media.deleteMedia(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete media.');
    }
  },
};

module.exports = api;

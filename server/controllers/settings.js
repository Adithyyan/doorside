const helpers = require('../helpers.js');
const db = require('../db.js');

const api = {
  async getPublicSettings(req, res) {
    const qObj = {};
    try {
      const rows = await db.any(req, 'select category, key, value from settings where is_public = true', qObj);
      const settings = {};
      (rows || []).forEach((r) => {
        if (!settings[r.category]) settings[r.category] = {};
        settings[r.category][r.key] = r.value;
      });
      return res.status(200).json({ success: true, data: { settings } });
    } catch (error) {
      req.log.error('settings.getPublicSettings(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get public settings.');
    }
  },

  async getHomepageSections(req, res) {
    const qObj = { category: 'homepage', key: 'sections' };
    try {
      const row = await db.oneOrNone(
        req,
        'select value from settings where category = $/category/ and key = $/key/',
        qObj,
      );
      const sections = row ? (typeof row.value === 'string' ? helpers.safeJsonParse(row.value) : row.value) : [];
      return res.status(200).json({ success: true, data: { sections } });
    } catch (error) {
      req.log.error('settings.getHomepageSections(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get homepage sections.');
    }
  },

  async getPageBySlug(req, res) {
    const qObj = {
      slug: req.params?.slug?.trim(),
    };

    if (!qObj.slug) {
      return res.status(400).json({ success: false, msg: 'Page slug is required' });
    }

    try {
      const page = await db.oneOrNone(
        req,
        'select * from pages where slug = $/slug/ and is_published = true',
        qObj,
      );
      if (!page) {
        req.log.warn('settings.getPageBySlug(): Page not found', qObj);
        return res.status(404).json({ success: false, msg: 'Page not found' });
      }
      return res.status(200).json({ success: true, data: { page } });
    } catch (error) {
      req.log.error('settings.getPageBySlug(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get page.');
    }
  },

  async adminGetSettings(req, res) {
    const qObj = {};
    try {
      const rows = await db.any(req, 'select * from settings order by category, key', qObj);
      return res.status(200).json({ success: true, data: { settings: rows } });
    } catch (error) {
      req.log.error('settings.adminGetSettings(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get settings.');
    }
  },

  async adminUpdateSettings(req, res) {
    const qObj = {
      settings: req.body?.settings || [],
    };

    if (!Array.isArray(qObj.settings)) {
      return res.status(400).json({ success: false, msg: 'Settings must be an array' });
    }

    try {
      await db.tx(async (t) => {
        for (const item of qObj.settings) {
          await t.none(
            `insert into settings (category, key, value, updated_at)
             values ($/category/, $/key/, $/value/, now())
             on conflict (category, key) do update set value = $/value/, updated_at = now()`,
            item,
          );
        }
      });
      req.log.info('settings.adminUpdateSettings(): Settings updated', { count: qObj.settings.length });
      return res.status(200).json({ success: true, msg: 'Settings updated successfully' });
    } catch (error) {
      req.log.error('settings.adminUpdateSettings(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update settings.');
    }
  },

  async adminGetPages(req, res) {
    const qObj = {};
    try {
      const pages = await db.any(req, 'select * from pages order by created_at desc', qObj);
      return res.status(200).json({ success: true, data: { pages } });
    } catch (error) {
      req.log.error('settings.adminGetPages(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get pages.');
    }
  },

  async adminCreatePage(req, res) {
    const qObj = {
      title: req.body?.title?.trim(),
      slug: req.body?.slug?.trim() || (req.body?.title ? helpers.createSlug(req.body.title) : null),
      contentHtml: req.body?.contentHtml || '',
      isPublished: req.body?.isPublished !== undefined ? req.body.isPublished : false,
      metaTitle: req.body?.metaTitle || null,
      metaDescription: req.body?.metaDescription || null,
    };

    if (!qObj.title) {
      return res.status(400).json({ success: false, msg: 'Title is required' });
    }

    try {
      const page = await db.one(
        req,
        `insert into pages (title, slug, content_html, is_published, meta_title, meta_description)
         values ($/title/, $/slug/, $/contentHtml/, $/isPublished/, $/metaTitle/, $/metaDescription/)
         returning *`,
        qObj,
      );
      req.log.info('settings.adminCreatePage(): Page created', { id: page.id, title: page.title });
      return res.status(201).json({ success: true, msg: 'Page created successfully', data: { page } });
    } catch (error) {
      req.log.error('settings.adminCreatePage(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create page.');
    }
  },
};

module.exports = api;

const helpers = require('../helpers.js');
const db = require('../db.js');

const api = {
  async adminGetSuppliers(req, res) {
    const qObj = {};
    try {
      const suppliers = await db.any(
        req,
        `select s.id, s.name, s.code, s.supplier_type, s.integration_type, s.contact_name, s.contact_email, s.contact_phone, s.is_active, s.created_at,
                count(p.id) as product_count
         from suppliers s
         left join products p on p.supplier_id = s.id
         group by s.id, s.name, s.code, s.supplier_type, s.integration_type, s.contact_name, s.contact_email, s.contact_phone, s.is_active, s.created_at
         order by s.created_at desc`,
        qObj,
      );
      return res.status(200).json({ success: true, data: { suppliers } });
    } catch (error) {
      req.log.error('suppliers.adminGetSuppliers(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get suppliers.');
    }
  },

  async adminCreateSupplier(req, res) {
    const qObj = {
      name: req.body?.name?.trim(),
      code: req.body?.code?.trim() || (req.body?.name ? helpers.createSlug(req.body.name).toUpperCase() : null),
      supplierType: req.body?.supplierType || 'manual_marketplace',
      integrationType: req.body?.integrationType || 'manual',
      configuration: JSON.stringify(req.body?.configuration || {}),
      contactName: req.body?.contactName || null,
      contactEmail: req.body?.contactEmail || null,
      contactPhone: req.body?.contactPhone || null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
    };

    if (!qObj.name) {
      return res.status(400).json({ success: false, msg: 'Supplier name is required' });
    }

    try {
      const supplier = await db.one(
        req,
        `insert into suppliers (name, code, supplier_type, integration_type, configuration, contact_name, contact_email, contact_phone, is_active)
         values ($/name/, $/code/, $/supplierType/, $/integrationType/, $/configuration/, $/contactName/, $/contactEmail/, $/contactPhone/, $/isActive/)
         returning *`,
        qObj,
      );

      req.log.info('suppliers.adminCreateSupplier(): Supplier created', { id: supplier.id, code: supplier.code });
      return res.status(201).json({ success: true, msg: 'Supplier created successfully', data: { supplier } });
    } catch (error) {
      req.log.error('suppliers.adminCreateSupplier(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create supplier.');
    }
  },

  async adminUpdateSupplier(req, res) {
    const qObj = {
      id: req.params?.id,
      name: req.body?.name || null,
      contactName: req.body?.contactName !== undefined ? req.body.contactName : null,
      contactEmail: req.body?.contactEmail !== undefined ? req.body.contactEmail : null,
      contactPhone: req.body?.contactPhone !== undefined ? req.body.contactPhone : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
    };

    try {
      const updated = await db.one(
        req,
        `update suppliers set
           name = coalesce($/name/, name),
           contact_name = coalesce($/contactName/, contact_name),
           contact_email = coalesce($/contactEmail/, contact_email),
           contact_phone = coalesce($/contactPhone/, contact_phone),
           is_active = coalesce($/isActive/, is_active),
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );

      req.log.info('suppliers.adminUpdateSupplier(): Supplier updated', { id: qObj.id });
      return res.status(200).json({ success: true, msg: 'Supplier updated successfully', data: { supplier: updated } });
    } catch (error) {
      req.log.error('suppliers.adminUpdateSupplier(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update supplier.');
    }
  },

  async adminDeleteSupplier(req, res) {
    const qObj = {
      id: req.params?.id,
    };

    try {
      await db.none(req, 'update suppliers set is_active = false, updated_at = now() where id = $/id/', qObj);
      req.log.info('suppliers.adminDeleteSupplier(): Supplier deactivated', qObj);
      return res.status(200).json({ success: true, msg: 'Supplier deactivated successfully' });
    } catch (error) {
      req.log.error('suppliers.adminDeleteSupplier(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete supplier.');
    }
  },
};

module.exports = api;

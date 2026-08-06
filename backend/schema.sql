-- PostgreSQL Schema Migration for Supply Chain Tool Database
-- Database: supply_chain_db

-- Drop tables if they exist
DROP TABLE IF EXISTS serial_numbers CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS stock_adjustments CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS storage_locations CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS stock_logs CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Create Categories Table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#6366f1',
    icon VARCHAR(50) DEFAULT 'fa-folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Warehouses Table
CREATE TABLE warehouses (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    address TEXT,
    manager VARCHAR(100),
    phone VARCHAR(50),
    capacity VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Storage Locations Table (Bins, Racks, Shelves)
CREATE TABLE storage_locations (
    id VARCHAR(36) PRIMARY KEY,
    warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    zone VARCHAR(50),
    aisle VARCHAR(20),
    rack VARCHAR(20),
    shelf VARCHAR(20),
    bin VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Suppliers Table
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    gstin VARCHAR(15) UNIQUE,
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    lead_time_days INT DEFAULT 7,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Products Table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category_id VARCHAR(36) REFERENCES categories(id) ON DELETE RESTRICT,
    barcode VARCHAR(50),
    description TEXT,
    cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 10,
    max_stock INT DEFAULT 500,
    reorder_level INT DEFAULT 30,
    reorder_qty INT DEFAULT 100,
    unit VARCHAR(20) DEFAULT 'pcs',
    supplier_id VARCHAR(36) REFERENCES suppliers(id) ON DELETE SET NULL,
    warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE SET NULL,
    location_bin VARCHAR(50),
    image_url TEXT,
    hsn_code VARCHAR(15),
    status VARCHAR(20) DEFAULT 'Active',
    variants TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Purchase Orders Table
CREATE TABLE purchase_orders (
    id VARCHAR(36) PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id VARCHAR(36) REFERENCES suppliers(id) ON DELETE RESTRICT,
    warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE RESTRICT,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'Pending Approval',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Purchase Order Items Table
CREATE TABLE purchase_order_items (
    id VARCHAR(36) PRIMARY KEY,
    purchase_order_id VARCHAR(36) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 18.00,
    discount_rate DECIMAL(5, 2) DEFAULT 0.00
);

-- 8. Create Stock Transfers Table
CREATE TABLE stock_transfers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    from_warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE RESTRICT,
    to_warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE RESTRICT,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending Approval',
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(50),
    approved_by VARCHAR(50)
);

-- 9. Create Stock Adjustments Table
CREATE TABLE stock_adjustments (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE RESTRICT,
    quantity_change INT NOT NULL,
    reason VARCHAR(100) NOT NULL, -- 'Damage', 'Loss', 'Expired'
    status VARCHAR(20) DEFAULT 'Approved',
    created_by VARCHAR(50),
    approved_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Batches Table (Expiry Tracking)
CREATE TABLE batches (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create Serial Numbers Table
CREATE TABLE serial_numbers (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) DEFAULT 'In Stock',
    warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE RESTRICT,
    location_bin VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Create Stock Audit Logs Table
CREATE TABLE stock_logs (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    change_qty INT NOT NULL,
    previous_qty INT NOT NULL,
    new_qty INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimized querying
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_quantity ON products(quantity);
CREATE INDEX idx_categories_code ON categories(code);
CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_suppliers_gstin ON suppliers(gstin);

-- Seed Initial Categories Data
INSERT INTO categories (id, name, code, description, color, icon) VALUES
('cat-1', 'Electronics & Sensors', 'ELEC', 'Microcontrollers, IoT sensors, PCB assemblies, and wiring harnesses.', '#6366f1', 'fa-microchip'),
('cat-2', 'Raw Materials', 'RAW', 'Steel alloys, aluminum billets, polymer resins, and chemical raw stock.', '#06b6d4', 'fa-cubes'),
('cat-3', 'Industrial Machinery', 'MACH', 'Pumps, electric motors, hydraulic valves, and pneumatic actuators.', '#f59e0b', 'fa-cogs'),
('cat-4', 'Packaging & Logistics', 'PKG', 'Heavy duty corrugated boxes, wooden pallets, strapping, and thermal labels.', '#10b981', 'fa-boxes-packing'),
('cat-5', 'Safety & PPE', 'PPE', 'Industrial safety helmets, high-visibility vests, respirators, and gloves.', '#ef4444', 'fa-hard-hat');

-- Seed Initial Warehouses
INSERT INTO warehouses (id, name, code, address, manager, phone, capacity, status, is_primary) VALUES
('wh-1', 'Central Logistics Hub', 'WH-CENTRAL', '100 Supply Chain Blvd, Industrial Park', 'David Miller', '+1 555-0192', '10,000 sq ft', 'Active', true),
('wh-2', 'East Coast Distribution Center', 'WH-EAST', '45 Harbor Commerce Way, NJ', 'Sarah Jenkins', '+1 555-0344', '25,000 sq ft', 'Active', false),
('wh-3', 'Overseas Transit Depot', 'WH-DEPOT', 'Port Terminal 4, Rotterdam', 'Jan de Jong', '+31 20 555 12', '15,000 sq ft', 'Active', false);

-- Seed Initial Suppliers
INSERT INTO suppliers (id, name, contact_person, email, phone, address, gstin, payment_terms, lead_time_days, rating) VALUES
('sup-1', 'Apex Automation Corp', 'Robert Chen', 'sales@apexauto.com', '+1 800-555-0111', 'San Jose, CA', '06AAAAC1111A1Z1', 'Net 30', 7, 4.8),
('sup-2', 'Vortex Drives Ltd', 'Klaus Webber', 'orders@vortexdrives.de', '+49 89 555 99', 'Munich, Germany', '06AAAAC2222B1Z2', 'Net 45', 14, 4.5),
('sup-3', 'Global Alloy Supplies', 'Elena Rostova', 'info@globalalloy.com', '+1 888-444-2211', 'Osaka, Japan', '06AAAAC3333C1Z3', 'Net 15', 5, 4.9),
('sup-4', 'SafeGuard PPE Global', 'Mark Taylor', 'support@safeguardppe.com', '+44 20 7946 0912', 'London, UK', '06AAAAC4444D1Z4', 'Net 30', 4, 4.2);

-- Seed Initial Products Data
INSERT INTO products (id, sku, name, category_id, barcode, description, cost_price, selling_price, quantity, min_stock, max_stock, unit, supplier_id, warehouse_id, location_bin, image_url, hsn_code, status, variants) VALUES
('prod-101', 'ELEC-SENS-001', 'Industrial Optocoupler Sensor Array', 'cat-1', '8901234567891', 'High-precision photoelectric sensor array rated for high-temperature automated assembly lines.', 42.50, 78.00, 145, 25, 500, 'pcs', 'sup-1', 'wh-1', 'A-12-04', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500', '85414900', 'Active', 'Standard, High Temp'),
('prod-102', 'MACH-MTR-088', '3-Phase AC Induction Motor 5.5kW', 'cat-3', '8901234567892', 'Heavy-duty 400V 5.5kW squirrel cage induction motor with IP55 weatherproof enclosure.', 380.00, 590.00, 8, 15, 60, 'pcs', 'sup-2', 'wh-1', 'B-04-01', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500', '85015220', 'Active', '5.5kW Foot Mount'),
('prod-103', 'RAW-STL-404', '316L Stainless Steel Precision Rods', 'cat-2', '8901234567893', 'Corrosion-resistant marine grade stainless steel round bars for CNC lathe turning.', 65.00, 110.00, 320, 50, 1000, 'pcs', 'sup-3', 'wh-2', 'R-01-18', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500', '72221119', 'Active', '20mm, 30mm'),
('prod-104', 'PKG-BOX-500', 'Triple-Wall Heavy Duty Shipping Boxes', 'cat-4', '8901234567894', 'Export-grade corrugated cardboard boxes designed for overseas container transport.', 2.10, 4.80, 1200, 200, 3000, 'boxes', 'sup-1', 'wh-2', 'P-08-02', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500', '48191010', 'Active', '500x500x500mm'),
('prod-105', 'PPE-HLM-202', 'ANSI Z89.1 Hard Hat with Visor Mount', 'cat-5', '8901234567895', 'Vented high-density polyethylene protective helmet with 6-point ratchet suspension.', 14.20, 28.50, 18, 40, 250, 'pcs', 'sup-4', 'wh-3', 'S-03-09', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500', '65061010', 'Active', 'Yellow, White, Blue');



CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'SALES',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN', 'SALES'))
);


CREATE INDEX idx_users_role
ON users(role);




CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    email VARCHAR(255),

    source VARCHAR(30) NOT NULL DEFAULT 'OTHER',

    stage VARCHAR(30) NOT NULL DEFAULT 'NEW',

    assigned_to UUID,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT leads_source_check
        CHECK (
            source IN (
                'WEBSITE',
                'PHONE',
                'WALK_IN',
                'REFERRAL',
                'SOCIAL_MEDIA',
                'OTHER'
            )
        ),

    CONSTRAINT leads_stage_check
        CHECK (
            stage IN (
                'NEW',
                'CONTACTED',
                'SITE_VISIT',
                'INTERESTED',
                'NEGOTIATION',
                'BOOKED',
                'LOST'
            )
        ),

    CONSTRAINT fk_leads_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);


CREATE INDEX idx_leads_stage
ON leads(stage);

CREATE INDEX idx_leads_assigned_to
ON leads(assigned_to);

CREATE INDEX idx_leads_phone
ON leads(phone);

CREATE INDEX idx_leads_email
ON leads(email);



CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lead_notes_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_lead_notes_lead_id
ON lead_notes(lead_id);




CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL,

    scheduled_at TIMESTAMP NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    remarks TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT follow_ups_status_check
        CHECK (
            status IN (
                'PENDING',
                'COMPLETED',
                'CANCELLED'
            )
        ),

    CONSTRAINT fk_follow_ups_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_follow_ups_lead_id
ON follow_ups(lead_id);

CREATE INDEX idx_follow_ups_scheduled_at
ON follow_ups(scheduled_at);

CREATE INDEX idx_follow_ups_status
ON follow_ups(status);




CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    description TEXT,

    location VARCHAR(255) NOT NULL,

    image_url TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_projects_name
ON projects(name);



CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_buildings_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_building_per_project
        UNIQUE (project_id, name)
);


CREATE INDEX idx_buildings_project_id
ON buildings(project_id);



CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    building_id UUID NOT NULL,

    unit_number VARCHAR(50) NOT NULL,

    type VARCHAR(30) NOT NULL,

    price DECIMAL(15, 2) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_units_building
        FOREIGN KEY (building_id)
        REFERENCES buildings(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_unit_per_building
        UNIQUE (building_id, unit_number),

    CONSTRAINT units_type_check
        CHECK (
            type IN (
                'APARTMENT',
                'VILLA',
                'PLOT',
                'OFFICE',
                'SHOP'
            )
        ),

    CONSTRAINT units_status_check
        CHECK (
            status IN (
                'AVAILABLE',
                'BOOKED',
                'BLOCKED'
            )
        ),

    CONSTRAINT units_price_check
        CHECK (price >= 0)
);


CREATE INDEX idx_units_building_id
ON units(building_id);

CREATE INDEX idx_units_status
ON units(status);


CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL UNIQUE,

    unit_id UUID NOT NULL UNIQUE,

    booked_by UUID NOT NULL,

    amount DECIMAL(15, 2) NOT NULL,

    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookings_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_bookings_unit
        FOREIGN KEY (unit_id)
        REFERENCES units(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_bookings_booked_by
        FOREIGN KEY (booked_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT bookings_amount_check
        CHECK (amount >= 0)
);


CREATE INDEX idx_bookings_booked_by
ON bookings(booked_by);

CREATE INDEX idx_bookings_booked_at
ON bookings(booked_at);



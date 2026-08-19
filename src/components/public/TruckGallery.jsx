import React, { useState } from 'react';

// Replace these `image` URLs with your real truck/pickup photos.
// Everything else (name, type, capacity, status) is placeholder copy —
// swap with your actual vehicle data.
const vehicleData = [
  {
    id: 1,
    name: 'Freightliner Cascadia',
    type: 'Semi truck',
    load: '38,000 lb',
    status: 'Loaded',
    image: '/media/trucks/01.jpeg',
  },
  {
    id: 2,
    name: 'Ford F-350',
    type: 'Pickup',
    load: '6,200 lb',
    status: 'Loaded',
    image: '/media/trucks/02.jpeg',
  },
  {
    id: 3,
    name: 'Peterbilt 579',
    type: 'Semi truck',
    load: '41,500 lb',
    status: 'In transit',
    image: '/media/trucks/03.jpeg',
  },
  {
    id: 4,
    name: 'Chevrolet Silverado 3500',
    type: 'Pickup',
    load: '5,800 lb',
    status: 'Loaded',
    image: '/media/trucks/04.jpeg',
  },
  {
    id: 5,
    name: 'International LT',
    type: 'Semi truck',
    load: '36,900 lb',
    status: 'Loading',
    image: '/media/trucks/06.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/07.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/08.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/08.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/10.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/11.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/12.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/13.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/14.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/15.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/16.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/17.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/18.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/19.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/20.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/21.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/23.jpeg',
  },
  {
    id: 6,
    name: 'RAM 3500',
    type: 'Pickup',
    load: '6,100 lb',
    status: 'Loaded',
    image: '/media/trucks/24.jpeg',
  },
];

const statusStyles = {
  Loaded: { bg: '#E1F5EE', text: '#085041' },
  'In transit': { bg: '#E6F1FB', text: '#0C447C' },
  Loading: { bg: '#FAEEDA', text: '#633806' },
};

function VehicleCard({ vehicle, onSelect }) {
  const status = statusStyles[vehicle.status] || statusStyles.Loaded;

  return (
    <button
      onClick={() => onSelect(vehicle)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        background: '#fff',
        border: '1px solid #e5e5e0',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4 / 3', background: '#1c1c1a' }}>
        <img
          src={vehicle.image}
          alt={vehicle.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '999px',
            background: status.bg,
            color: status.text,
          }}
        >
          {vehicle.status}
        </span>
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1c1c1a' }}>
          {vehicle.name}
        </p>
        <p style={{ margin: '2px 0 10px', fontSize: 13, color: '#7a7a75' }}>{vehicle.type}</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #efefe9',
            paddingTop: 10,
          }}
        >
          <span style={{ fontSize: 12, color: '#7a7a75' }}>Load capacity</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1c1a' }}>{vehicle.load}</span>
        </div>
      </div>
    </button>
  );
}

function VehicleModal({ vehicle, onClose }) {
  if (!vehicle) return null;
  const status = statusStyles[vehicle.status] || statusStyles.Loaded;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          maxWidth: 560,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={vehicle.image}
            alt={vehicle.name}
            style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: '' }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              background: status.bg,
              color: status.text,
            }}
          >
            {vehicle.status}
          </span>
          <h2 style={{ margin: '12px 0 4px', fontSize: 20, fontWeight: 600, color: '#1c1c1a' }}>
            {vehicle.name}
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7a7a75' }}>{vehicle.type}</p>
          <div style={{ display: 'flex', gap: 24, borderTop: '1px solid #efefe9', paddingTop: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#7a7a75' }}>Load capacity</p>
              <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#1c1c1a' }}>
                {vehicle.load}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TruckGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ background: '#f7f7f2', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1c1c1a', margin: '0 0 4px' }}>
          Fleet gallery
        </h1>
        <p style={{ fontSize: 14, color: '#7a7a75', margin: '0 0 24px' }}>
          Trucks and pickups currently loaded or in transit.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {vehicleData.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={setSelected} />
          ))}
        </div>
      </div>

      <VehicleModal vehicle={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
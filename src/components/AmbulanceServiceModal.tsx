import React from 'react';
import { SocialAidModal } from './SocialAidModal';

interface AmbulanceServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonateAmbulance: () => void;
}

export const AmbulanceServiceModal: React.FC<AmbulanceServiceModalProps> = ({
  isOpen,
  onClose,
  onDonateAmbulance
}) => {
  return (
    <SocialAidModal
      isOpen={isOpen}
      onClose={onClose}
      onDonateAid={onDonateAmbulance}
    />
  );
};

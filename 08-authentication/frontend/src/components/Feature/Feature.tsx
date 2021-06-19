import requireAuth from "../requireAuth"

interface FeatureProps {
  message?: string
}

const Feature: React.FC<FeatureProps> = ({ message }) => {
  return <div>Features{message && ` ${message}`}</div>
}

export default requireAuth<FeatureProps>(Feature)

import React from 'react';
import { AlertCircle, FileQuestion } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

interface MissingInformationCardProps {
  missingInformation: string[];
}

export const MissingInformationCard: React.FC<MissingInformationCardProps> = ({ missingInformation }) => {
  if (!missingInformation || missingInformation.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/40 shadow-card min-w-0">
      <CardHeader
        title="Information You May Want to Tell Your Doctor"
        subtitle="Key details not mentioned in your description that your doctor may ask about"
        icon={<FileQuestion className="w-5 h-5 text-amber-600" />}
      />
      <CardContent>
        <ul className="space-y-2">
          {missingInformation.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-amber-900 bg-white p-3 rounded-xl border border-amber-100 shadow-subtle leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

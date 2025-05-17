import * as Icons from 'lucide-react';
  CheckCircle, Plus, X, Check, Trash2, Clock, AlertCircle, Tag, Sun, Moon, LogOut
export const getIcon = (iconName) => {
  return (Icons[iconName] && typeof Icons[iconName] === 'function') 
    ? Icons[iconName] 
    : Icons.Smile;
};
  Moon,
  LogOut
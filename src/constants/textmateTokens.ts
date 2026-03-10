import type { TextMateTokenDef } from '@/types';

export const TEXTMATE_TOKENS: TextMateTokenDef[] = [
  { scope: 'comment', label: 'Comment', group: 'basic' },
  { scope: 'string', label: 'String', group: 'basic' },
  { scope: 'keyword', label: 'Keyword', group: 'basic' },
  { scope: 'constant.numeric', label: 'Number', group: 'basic' },
  { scope: 'entity.name.function', label: 'Function Name', group: 'basic' },
  { scope: 'entity.name.type', label: 'Type Name', group: 'basic' },
  { scope: 'variable', label: 'Variable', group: 'basic' },
  { scope: 'support.type', label: 'Support Type', group: 'basic' },
  { scope: 'storage.type', label: 'Storage Type', group: 'basic' },
  { scope: 'invalid', label: 'Invalid', group: 'basic' },
  { scope: 'entity.name.class', label: 'Class Name', group: 'advanced' },
  { scope: 'entity.name.interface', label: 'Interface Name', group: 'advanced' },
  { scope: 'variable.parameter', label: 'Parameter', group: 'advanced' },
  { scope: 'variable.other.property', label: 'Property', group: 'advanced' },
  { scope: 'punctuation', label: 'Punctuation', group: 'advanced' },
  { scope: 'meta.decorator', label: 'Decorator', group: 'advanced' },
  { scope: 'string.template', label: 'Template String', group: 'advanced' },
  { scope: 'constant.regexp', label: 'Regex', group: 'advanced' },
  { scope: 'support.function', label: 'Support Function', group: 'advanced' },
  { scope: 'keyword.operator', label: 'Operator', group: 'advanced' },
];

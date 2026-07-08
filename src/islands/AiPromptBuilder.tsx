import { useMemo, useState } from 'react';

export default function AiPromptBuilder() {
  const [role, setRole] = useState('Você é um redator publicitário especialista em e-commerce.');
  const [task, setTask] = useState('Escreva uma descrição de produto persuasiva.');
  const [context, setContext] = useState('O produto é um fone de ouvido bluetooth com cancelamento de ruído.');
  const [format, setFormat] = useState('Um parágrafo de até 100 palavras, tom informal.');
  const [constraints, setConstraints] = useState('Não invente características que não foram mencionadas.');
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const parts = [
      role.trim() && `Papel: ${role.trim()}`,
      task.trim() && `Tarefa: ${task.trim()}`,
      context.trim() && `Contexto: ${context.trim()}`,
      format.trim() && `Formato de saída: ${format.trim()}`,
      constraints.trim() && `Restrições: ${constraints.trim()}`,
    ].filter(Boolean);
    return parts.join('\n\n');
  }, [role, task, context, format, constraints]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const fields: [string, string, (v: string) => void][] = [
    ['Papel / persona da IA', role, setRole],
    ['Tarefa', task, setTask],
    ['Contexto', context, setContext],
    ['Formato de saída', format, setFormat],
    ['Restrições (opcional)', constraints, setConstraints],
  ];

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4">
        {fields.map(([label, value, setter]) => (
          <label key={label} className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
            <textarea
              value={value}
              onChange={(e) => setter(e.target.value)}
              rows={2}
              className="w-full resize-y rounded-lg border p-3 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </label>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Prompt montado
        </p>
        <pre
          className="w-full whitespace-pre-wrap rounded-lg p-4 font-mono text-xs"
          style={{ background: 'var(--color-accent-soft)' }}
        >
          {prompt || 'Preencha os campos acima'}
        </pre>
      </div>

      <button
        onClick={copyPrompt}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition"
        style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
      >
        {copied ? 'Copiado!' : 'Copiar prompt'}
      </button>
    </div>
  );
}

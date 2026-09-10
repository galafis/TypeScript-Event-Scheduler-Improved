# Validation record / Registro de validação

Review date / Data da revisão: 2026-09-10.

## Change and reason / Mudança e motivo

EN: Restored the missing scheduling implementation and browser module; repaired the build; added immutable reads, UTC boundary tests and atomic JSON import.

PT: Restaurados implementação de agendamento e módulo do navegador; corrigida compilação; adicionados leitura protegida, testes de limites UTC e importação JSON atômica.

## Reproduce / Reproduzir

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

## Example evidence / Evidência do exemplo

The example adds one design-review event at 2026-10-01T14:00:00Z and verifies it belongs to that UTC day. / O exemplo adiciona uma revisão de projeto em 2026-10-01T14:00:00Z e verifica o dia UTC correspondente.

EN: The suite includes normal operations and regression cases for the corrected behavior. The example checks values produced by the implementation. Use the linked workflow to inspect the result for a specific commit; no performance benchmark is inferred from a passing build.

PT: A suíte inclui operações válidas e regressões dos comportamentos corrigidos. O exemplo verifica valores produzidos pela implementação. Consulte a automação para conferir o resultado de um commit específico; aprovação de compilação não implica benchmark de desempenho.

## Limits / Limites

EN: Dates in the browser form are UTC, not local time. No calendar synchronization, reminders, collaboration server or recurring-event engine is included. Browser storage can be cleared; export backups when needed.

PT: Datas do formulário são UTC, não hora local. Não há sincronização de calendário, lembretes, servidor colaborativo ou eventos recorrentes. O armazenamento do navegador pode ser apagado; exporte cópias quando necessário.

[Return to README / Voltar ao README](../README.md)

## Verified suite / Suíte verificada

**19 software tests passed / testes de software aprovados.**

README Mermaid syntax and local documentation links were checked. / A sintaxe Mermaid do README e os links locais da documentação foram conferidos.

## Additional contract checks · Verificações adicionais de contrato

JSON import rejects impossible calendar dates, invalid time components and unknown fields before replacing existing events. Leap years, fractional seconds and explicit UTC offsets are checked; accepted dates use four-digit UTC years (0000–9999).

A importação JSON rejeita datas impossíveis, componentes de horário inválidos e campos desconhecidos antes de substituir eventos. Anos bissextos, frações de segundo e fusos explícitos são verificados; datas aceitas usam anos UTC de quatro dígitos (0000–9999).

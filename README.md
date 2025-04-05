# Validador Lógico Aristotélico - README

## 📚 Visão Geral do Projeto

O Validador Lógico Aristotélico é uma ferramenta educacional interativa para estudo de silogismos categóricos baseados na lógica aristotélica. O sistema permite:

1. **Analisar a validade** de silogismos de acordo com as regras clássicas
2. **Identificar automaticamente** a figura do silogismo (1ª a 4ª figura)
3. **Verificar cada regra lógica** individualmente
4. **Testar conhecimentos** através de um modo quiz com feedback imediato

## 🔍 Fundamentos Lógicos Implementados

### Silogismos Aristotélicos
O sistema implementa as quatro figuras clássicas dos silogismos com todas as regras de validade:

1. **Distribuição do Termo Médio**:
   - O termo médio deve estar distribuído em pelo menos uma premissa
   - Implementado via análise sintática das proposições

2. **Ilícitos Maior e Menor**:
   - Verificação automática de termos distribuídos na conclusão
   - Comparação com a distribuição nas premissas

3. **Regras de Qualidade**:
   - Duas premissas negativas não podem gerar conclusão
   - Premissa negativa exige conclusão negativa

4. **Regras de Quantidade**:
   - Premissa particular exige conclusão particular
   - Implementado via análise de quantificadores ("Todos", "Alguns", "Nenhum")

## 💻 Tecnologias Utilizadas

### Frontend
- **HTML5 Semântico**: Estrutura acessível com `<section>` dedicadas
- **CSS3 Moderno**:
  - Variáveis CSS para theming (`:root`)
  - Layouts flexíveis com Flexbox e Grid
  - Design responsivo com media queries
- **JavaScript (ES6+)**:
  - Manipulação dinâmica do DOM
  - Lógica de validação com expressões regulares
  - Algoritmos de análise sintática

### Técnicas Avançadas
1. **Análise Sintática**:
   ```javascript
   function extractTermsFromProposition(proposition) {
       const parts = proposition.split(' ');
       const quantifier = parts[0];
       const subject = parts[1];
       let predicate = parts[parts.length - 1];
       predicate = predicate.replace(/[.,]/g, '');
       
       return { quantifier, subject, predicate };
   }
   ```

2. **Padrão de Projeto State**:
   ```javascript
   let quizState = {
       currentQuestion: 1,
       totalQuestions: 5,
       score: 0,
       attempted: 0
   };
   ```

3. **Feedback Visual**:
   - Códigos de cores (verde/vermelho) para validação
   - Ícones intuitivos (✅/❌) para vereditos

## 🛠️ Funcionalidades Principais

### 1. Validador Completo
- Entrada de premissas em linguagem natural
- Extração automática de termos (S, P, M)
- Identificação da figura do silogismo
- Verificação detalhada de cada regra

### 2. Modo Teoria
- Explicações das 4 figuras silogísticas
- Exemplos clássicos para cada figura
- Representação visual das estruturas

### 3. Modo Quiz
- Banco com 5 questões fundamentais
- Sistema de pontuação com feedback
- Explicações detalhadas para cada resposta

## 📌 Casos de Uso Típicos

1. **Para Estudantes**:
   - Verificar exercícios de lógica formal
   - Compreender erros em silogismos inválidos
   - Preparar-se para provas acadêmicas

2. **Para Professores**:
   - Demonstrar exemplos em sala de aula
   - Criar exercícios com feedback automático
   - Ilustrar falácias comuns

3. **Autodidatas**:
   - Aprender lógica aristotélica de forma interativa
   - Testar compreensão dos conceitos
   - Desenvolver pensamento crítico

## 🚀 Estrutura do Código

```
validador-logico/
├── index.html        # Estrutura principal
├── styles.css        # Estilos e layout
└── script.js         # Lógica de aplicação
```

## ⚙️ Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/validador-logico.git
   ```

2. Abra o arquivo `index.html` em qualquer navegador moderno.

## 🎯 Diferenciais Pedagógicos

- **Feedback Detalhado**: Explica cada regra violada
- **Visualização Clara**: Destaque dos termos S, P, M
- **Aprendizado Ativo**: Modo quiz com explicações
- **Portabilidade**: Funciona offline após baixado

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const theoryBtn = document.getElementById('theory-btn');
    const validateBtn = document.getElementById('validate-btn');
    const quizBtn = document.getElementById('quiz-btn');
    const theorySection = document.querySelector('.theory-section');
    const validateSection = document.querySelector('.validate-section');
    const quizSection = document.querySelector('.quiz-section');
    const checkValidityBtn = document.getElementById('check-validity');
    const majorPremiseInput = document.getElementById('major-premise');
    const minorPremiseInput = document.getElementById('minor-premise');
    const conclusionInput = document.getElementById('conclusion');
    const validationResult = document.querySelector('.validation-result');
    const syllogismAnalysis = document.querySelector('.syllogism-analysis');
    const termP = document.getElementById('term-p');
    const termS = document.getElementById('term-s');
    const termM = document.getElementById('term-m');
    const figureSpan = document.getElementById('figure');
    const rulesList = document.getElementById('rules-list');
    const verdict = document.getElementById('verdict');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.querySelector('.quiz-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const nextQuestionBtn = document.getElementById('next-question');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const scoreSpan = document.getElementById('score');
    const attemptedSpan = document.getElementById('attempted');
    const questionText = document.getElementById('question-text');

    // Estado da aplicação
    let currentMode = 'theory';
    let quizState = {
        currentQuestion: 1,
        totalQuestions: 5,
        score: 0,
        attempted: 0
    };

    // Banco de questões do quiz
    const quizQuestions = [
        {
            question: 'O silogismo a seguir é válido?<br>"Todos M são P. Todos S são M. Logo, todos S são P."',
            options: ['Válido', 'Inválido'],
            correct: 0,
            feedback: 'Correto! Este é um exemplo clássico da 1ª figura, que é sempre válido quando o termo médio está distribuído na primeira premissa.'
        },
        {
            question: 'O silogismo a seguir é válido?<br>"Nenhum P é M. Alguns S são M. Logo, alguns S não são P."',
            options: ['Válido', 'Inválido'],
            correct: 0,
            feedback: 'Correto! Este é um exemplo válido da 2ª figura, onde o termo médio é predicado em ambas as premissas.'
        },
        {
            question: 'O silogismo a seguir é válido?<br>"Todos P são M. Alguns M são S. Logo, alguns S são P."',
            options: ['Válido', 'Inválido'],
            correct: 1,
            feedback: 'Incorreto! Este silogismo é inválido porque o termo médio não está distribuído em nenhuma das premissas (falácia do termo médio não distribuído).'
        },
        {
            question: 'O silogismo a seguir é válido?<br>"Alguns M são P. Todos M são S. Logo, alguns S são P."',
            options: ['Válido', 'Inválido'],
            correct: 0,
            feedback: 'Correto! Este é um exemplo válido da 3ª figura, onde o termo médio é sujeito em ambas as premissas.'
        },
        {
            question: 'O silogismo a seguir é válido?<br>"Nenhum P é M. Nenhum S é M. Logo, nenhum S é P."',
            options: ['Válido', 'Inválido'],
            correct: 1,
            feedback: 'Incorreto! Este silogismo é inválido porque viola a regra que proíbe conclusões de duas premissas negativas.'
        }
    ];

    // Funções para alternar entre seções
    function showTheory() {
        theorySection.classList.remove('hidden');
        validateSection.classList.add('hidden');
        quizSection.classList.add('hidden');
        currentMode = 'theory';
    }

    function showValidation() {
        theorySection.classList.add('hidden');
        validateSection.classList.remove('hidden');
        quizSection.classList.add('hidden');
        currentMode = 'validate';
    }

    function showQuiz() {
        theorySection.classList.add('hidden');
        validateSection.classList.add('hidden');
        quizSection.classList.remove('hidden');
        currentMode = 'quiz';
        loadQuizQuestion();
    }

    // Funções para análise de silogismos
    function checkSyllogismValidity() {
        const majorPremise = majorPremiseInput.value.trim();
        const minorPremise = minorPremiseInput.value.trim();
        const conclusion = conclusionInput.value.trim();

        if (!majorPremise || !minorPremise || !conclusion) {
            validationResult.textContent = 'Por favor, preencha todas as premissas e a conclusão.';
            validationResult.className = 'validation-result wrong';
            syllogismAnalysis.classList.add('hidden');
            return;
        }

        // Extrair termos
        const terms = extractTerms(majorPremise, minorPremise, conclusion);
        if (!terms) {
            validationResult.textContent = 'Não foi possível identificar os termos do silogismo. Verifique a estrutura.';
            validationResult.className = 'validation-result wrong';
            syllogismAnalysis.classList.add('hidden');
            return;
        }

        // Atualizar análise
        termP.textContent = terms.P;
        termS.textContent = terms.S;
        termM.textContent = terms.M;
        figureSpan.textContent = determineFigure(terms.M, majorPremise, minorPremise);

        // Verificar regras
        const rules = checkRules(majorPremise, minorPremise, conclusion, terms);
        updateRulesList(rules);

        // Determinar veredito
        const isValid = rules.every(rule => rule.valid);
        verdict.textContent = isValid ? '✅ Silogismo VÁLIDO' : '❌ Silogismo INVÁLIDO';
        verdict.style.color = isValid ? 'var(--correct-color)' : 'var(--wrong-color)';

        // Mostrar resultados
        validationResult.textContent = isValid ? 
            'Este silogismo é válido de acordo com as regras aristotélicas.' : 
            'Este silogismo é inválido. Verifique as regras violadas abaixo.';
        validationResult.className = isValid ? 'validation-result correct' : 'validation-result wrong';
        syllogismAnalysis.classList.remove('hidden');
    }

    function extractTerms(majorPremise, minorPremise, conclusion) {
        // Padrões para identificar termos
        const subjectPattern = /^(Todos|Alguns|Nenhum)\s+([^ ]+)/i;
        const predicatePattern = /([^ ]+)\s*$/;
        
        try {
            // Extrair P e S da conclusão
            const conclusionMatch = conclusion.match(subjectPattern);
            if (!conclusionMatch) return null;
            
            const S = conclusionMatch[2];
            const P = conclusion.split(' ').pop().replace('.', '');
            
            // Extrair M das premissas
            let M = null;
            const majorTerms = extractTermsFromProposition(majorPremise);
            const minorTerms = extractTermsFromProposition(minorPremise);
            
            if (majorTerms.subject !== S && majorTerms.subject !== P) M = majorTerms.subject;
            else if (majorTerms.predicate !== S && majorTerms.predicate !== P) M = majorTerms.predicate;
            else if (minorTerms.subject !== S && minorTerms.subject !== P) M = minorTerms.subject;
            else if (minorTerms.predicate !== S && minorTerms.predicate !== P) M = minorTerms.predicate;
            
            if (!M) return null;
            
            return { S, P, M };
        } catch (e) {
            return null;
        }
    }

    function extractTermsFromProposition(proposition) {
        const parts = proposition.split(' ');
        const quantifier = parts[0];
        const subject = parts[1];
        let predicate = parts[parts.length - 1];
        
        // Remover pontuação final
        predicate = predicate.replace(/[.,]/g, '');
        
        return {
            quantifier,
            subject,
            predicate
        };
    }

    function determineFigure(M, majorPremise, minorPremise) {
        const majorTerms = extractTermsFromProposition(majorPremise);
        const minorTerms = extractTermsFromProposition(minorPremise);
        
        if (majorTerms.predicate === M && minorTerms.subject === M) return '1ª Figura';
        if (majorTerms.subject === M && minorTerms.subject === M) return '2ª Figura';
        if (majorTerms.predicate === M && minorTerms.predicate === M) return '3ª Figura';
        if (majorTerms.subject === M && minorTerms.predicate === M) return '4ª Figura';
        
        return 'Figura não identificada';
    }

    function checkRules(majorPremise, minorPremise, conclusion, terms) {
        const majorTerms = extractTermsFromProposition(majorPremise);
        const minorTerms = extractTermsFromProposition(minorPremise);
        const conclusionTerms = extractTermsFromProposition(conclusion);
        
        const rules = [
            {
                name: 'Termo médio distribuído',
                description: 'O termo médio deve estar distribuído em pelo menos uma premissa',
                valid: isMiddleTermDistributed(majorPremise, minorPremise, terms.M)
            },
            {
                name: 'Nenhum termo distribuído na conclusão sem estar nas premissas',
                description: 'Evitar ilícito maior ou menor',
                valid: !hasIllicitMajorOrMinor(majorPremise, minorPremise, conclusion)
            },
            {
                name: 'Premissas negativas não geram conclusão afirmativa',
                description: 'Se alguma premissa é negativa, a conclusão deve ser negativa',
                valid: !(isNegative(majorPremise) || isNegative(conclusion)) && 
                       !(isNegative(minorPremise) || isNegative(conclusion))
            },
            {
                name: 'Conclusão segue a premissa mais fraca',
                description: 'Se uma premissa é particular, a conclusão deve ser particular',
                valid: !(isParticular(majorPremise) || isParticular(minorPremise)) || 
                       isParticular(conclusion)
            },
            {
                name: 'Nenhuma conclusão de duas premissas negativas',
                description: 'Duas premissas negativas não podem gerar conclusão',
                valid: !(isNegative(majorPremise) && isNegative(minorPremise))
            }
        ];
        
        return rules;
    }

    function isMiddleTermDistributed(majorPremise, minorPremise, M) {
        // Verifica se o termo médio está distribuído em alguma premissa
        return isTermDistributed(majorPremise, M) || isTermDistributed(minorPremise, M);
    }

    function isTermDistributed(proposition, term) {
        const terms = extractTermsFromProposition(proposition);
        
        // Termo está distribuído se:
        // 1. É sujeito de uma universal afirmativa (Todos S são P)
        // 2. É sujeito de uma universal negativa (Nenhum S é P)
        // 3. É predicado de uma negativa (Nenhum P é S)
        
        if (terms.subject === term) {
            return terms.quantifier.toLowerCase() === 'todos' || 
                   terms.quantifier.toLowerCase() === 'nenhum';
        }
        
        if (terms.predicate === term) {
            return terms.quantifier.toLowerCase() === 'nenhum';
        }
        
        return false;
    }

    function hasIllicitMajorOrMinor(majorPremise, minorPremise, conclusion) {
        const conclusionTerms = extractTermsFromProposition(conclusion);
        
        // Verificar ilícito maior (P distribuído na conclusão mas não nas premissas)
        const PDistributedInConclusion = isTermDistributed(conclusion, conclusionTerms.predicate);
        const PDistributedInPremises = isTermDistributed(majorPremise, conclusionTerms.predicate) || 
                                      isTermDistributed(minorPremise, conclusionTerms.predicate);
        
        if (PDistributedInConclusion && !PDistributedInPremises) return true;
        
        // Verificar ilícito menor (S distribuído na conclusão mas não nas premissas)
        const SDistributedInConclusion = isTermDistributed(conclusion, conclusionTerms.subject);
        const SDistributedInPremises = isTermDistributed(majorPremise, conclusionTerms.subject) || 
                                      isTermDistributed(minorPremise, conclusionTerms.subject);
        
        if (SDistributedInConclusion && !SDistributedInPremises) return true;
        
        return false;
    }

    function isNegative(proposition) {
        return proposition.toLowerCase().startsWith('nenhum');
    }

    function isParticular(proposition) {
        return proposition.toLowerCase().startsWith('alguns');
    }

    function updateRulesList(rules) {
        rulesList.innerHTML = '';
        
        rules.forEach(rule => {
            const li = document.createElement('li');
            li.textContent = `${rule.name}: ${rule.description}`;
            if (!rule.valid) li.classList.add('invalid');
            rulesList.appendChild(li);
        });
    }

    // Funções para o modo quiz
    function loadQuizQuestion() {
        if (quizState.currentQuestion > quizState.totalQuestions) {
            // Quiz completo
            questionText.innerHTML = `Quiz completo!<br>Sua pontuação final: ${quizState.score}/${quizState.totalQuestions}`;
            document.querySelector('.quiz-options').classList.add('hidden');
            nextQuestionBtn.textContent = 'Reiniciar Quiz';
            nextQuestionBtn.addEventListener('click', resetQuiz);
            return;
        }
        
        const question = quizQuestions[quizState.currentQuestion - 1];
        questionText.innerHTML = question.question;
        
        quizOptions.forEach((option, index) => {
            option.textContent = question.options[index];
            option.dataset.correct = index === question.correct ? 'true' : 'false';
        });
        
        currentQuestionSpan.textContent = quizState.currentQuestion;
        totalQuestionsSpan.textContent = quizState.totalQuestions;
        quizFeedback.classList.add('hidden');
    }

    function checkQuizAnswer(selectedOption) {
        quizState.attempted++;
        const isCorrect = selectedOption.dataset.correct === 'true';
        
        if (isCorrect) {
            quizState.score++;
            quizFeedback.className = 'quiz-feedback correct';
            feedbackText.textContent = quizQuestions[quizState.currentQuestion - 1].feedback;
        } else {
            quizFeedback.className = 'quiz-feedback wrong';
            feedbackText.textContent = quizQuestions[quizState.currentQuestion - 1].feedback;
        }
        
        scoreSpan.textContent = quizState.score;
        attemptedSpan.textContent = quizState.attempted;
        quizFeedback.classList.remove('hidden');
    }

    function nextQuestion() {
        quizState.currentQuestion++;
        loadQuizQuestion();
    }

    function resetQuiz() {
        quizState = {
            currentQuestion: 1,
            totalQuestions: 5,
            score: 0,
            attempted: 0
        };
        
        document.querySelector('.quiz-options').classList.remove('hidden');
        nextQuestionBtn.textContent = 'Próxima Questão';
        nextQuestionBtn.removeEventListener('click', resetQuiz);
        nextQuestionBtn.addEventListener('click', nextQuestion);
        loadQuizQuestion();
    }

    // Event listeners
    theoryBtn.addEventListener('click', showTheory);
    validateBtn.addEventListener('click', showValidation);
    quizBtn.addEventListener('click', showQuiz);
    checkValidityBtn.addEventListener('click', checkSyllogismValidity);
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (!quizFeedback.classList.contains('hidden')) return;
            checkQuizAnswer(this);
        });
    });
    
    nextQuestionBtn.addEventListener('click', nextQuestion);

    // Iniciar na seção de teoria
    showTheory();
});

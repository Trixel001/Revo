document.addEventListener('DOMContentLoaded', () => {
    const voiceOrbContainer = document.getElementById('ai-voice-orb-container');
    const voiceOrb = document.getElementById('ai-voice-orb');
    const cancelVoiceSessionBtn = document.getElementById('cancel-voice-session');
    const interactiveButtons = document.querySelectorAll('.interactive-btn');
    const universalAudioPlayer = document.getElementById('universal-audio-player');

    let isVoiceSessionActive = false;
    let isListening = false;
    let isSpeaking = false;
    let recognition;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    } else {
        console.error("Speech Recognition not supported in this browser.");
    }

    function startVoiceSession(context) {
        if (!SpeechRecognition) {
            alert("Sorry, your browser doesn't support voice commands.");
            return;
        }
        isVoiceSessionActive = true;
        voiceOrbContainer.classList.remove('hidden');
        gsap.fromTo(voiceOrbContainer, { opacity: 0 }, { opacity: 1, duration: 0.3 });

        const { service, action } = context;
        let greeting = `I can ${action} our ${service} service. What would you like to know?`;
        speak(greeting);
    }

    function endVoiceSession() {
        isVoiceSessionActive = false;
        isListening = false;
        isSpeaking = false;
        if (recognition) {
            recognition.stop();
        }
        speechSynthesis.cancel();
        gsap.to(voiceOrbContainer, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => voiceOrbContainer.classList.add('hidden')
        });
        restoreMusicVolume();
    }

    function speak(text) {
        isSpeaking = true;
        isListening = false;
        updateOrbState();
        lowerMusicVolume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            if (isVoiceSessionActive) {
                listen();
            }
        };
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            if (isVoiceSessionActive) {
                listen();
            }
        };
        speechSynthesis.speak(utterance);
    }

    function listen() {
        isListening = true;
        isSpeaking = false;
        updateOrbState();
        restoreMusicVolume();

        recognition.start();
    }

    function updateOrbState() {
        voiceOrb.innerHTML = '';
        let icon = 'mic';
        if (isSpeaking) {
            icon = 'volume-2';
            voiceOrb.classList.add('speaking-animation');
            voiceOrb.classList.remove('listening-animation');
        } else if (isListening) {
            icon = 'mic';
            voiceOrb.classList.add('listening-animation');
            voiceOrb.classList.remove('speaking-animation');
        } else {
            voiceOrb.classList.remove('listening-animation', 'speaking-animation');
        }
        voiceOrb.innerHTML = `<i data-lucide="${icon}" class="w-10 h-10"></i>`;
        lucide.createIcons();
    }

    function lowerMusicVolume() {
        gsap.to(universalAudioPlayer, { volume: 0.2, duration: 0.5 });
    }

    function restoreMusicVolume() {
        gsap.to(universalAudioPlayer, { volume: 1.0, duration: 0.5 });
    }

    interactiveButtons.forEach(button => {
        button.addEventListener('click', function() {
            if(isVoiceSessionActive) return;

            const card = this.closest('.card');
            const serviceTitle = card.querySelector('h3').textContent;
            const action = this.textContent.toLowerCase();

            const context = {
                service: serviceTitle,
                action: action,
            };
            startVoiceSession(context);
        });
    });

    cancelVoiceSessionBtn.addEventListener('click', endVoiceSession);

    if(recognition){
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('User said:', transcript);
            // This is where you would process the transcript and generate a response
            speak("I heard you say: " + transcript + ". I am still under development, but I am learning.");
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onend = () => {
            if (isVoiceSessionActive && !isSpeaking) {
                // Keep listening if the session is still active
                listen();
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech' && isVoiceSessionActive) {
                // If no speech is detected, just start listening again
                listen();
            } else {
                endVoiceSession();
            }
        };
    }
});
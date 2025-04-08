const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioURL, setAudioURL] = React.useState('');
    const mediaRecorderRef = React.useRef(null);
    const chunksRef = React.useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="voice-recorder">
            {isRecording ? (
                <>
                    <span className="recording-indicator">●</span>
                    <button className="btn" onClick={stopRecording}>⏹ Stop Recording</button>
                </>
            ) : (
                <button className="btn" onClick={startRecording}>🎤 Start Recording</button>
            )}
            {audioURL && (
                <audio controls src={audioURL} className="audio-player" />
            )}
        </div>
    );
};
"use client"

import React, {useState, useRef, useCallback} from 'react';
import {Button} from './button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './dialog';
import {Progress} from './progress';
import {Upload, X, CheckCircle, AlertCircle, Cloud, Plus} from 'lucide-react';
import {getUploadPresignedUrl} from "@/actions/s3";

// Props per il componente UploadBox
export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface UploadBoxProps {
    // Testo del button trigger
    buttonText?: string;
    // Variante del button
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    // Dimensione del button
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    // Titolo del modal
    modalTitle?: string;
    // Descrizione del modal
    modalDescription?: string;
    // Tipi di file accettati
    acceptedFileTypes?: string;
    // Dimensione massima file in MB
    maxFileSize?: number;
    // Callback chiamato quando l'upload è completato con successo
    onUploadSuccess?: (url: string, file: File) => void;
    // Callback chiamato quando l'upload fallisce
    onUploadError?: (error: string, file: File) => void;
    // Callback chiamato durante il progresso dell'upload
    onUploadProgress?: (progress: UploadProgress, file: File) => void;
    // Se mostrare la progress bar
    showProgress?: boolean;
    // Se permettere multipli file
    multiple?: boolean;
    // Classe CSS personalizzata per il button
    buttonClassName?: string;
    // Se disabilitare il component
    disabled?: boolean;
    // Icona personalizzata per il button
    icon?: React.ReactNode;
    // Se resettare lo stato quando il dialog viene chiuso
    resetOnClose?: boolean;
    // Se mostrare solo l'icona nel button trigger
    buttonIcon?: boolean;
    // Se mostrare il dialog (controllato dall'esterno)
    open?: boolean;
    // Callback chiamato quando lo stato del dialog cambia
    onOpenChange?: (open: boolean) => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
                                                        buttonText = 'Carica File',
                                                        buttonVariant = "default",
                                                        buttonSize = 'default',
                                                        modalTitle = 'Carica File',
                                                        modalDescription = 'Seleziona i file da caricare',
                                                        acceptedFileTypes = '*',
                                                        maxFileSize = 10, // MB
                                                        onUploadSuccess,
                                                        onUploadError,
                                                        onUploadProgress,
                                                        showProgress = true,
                                                        multiple = false,
                                                        buttonClassName,
                                                        disabled = false,
                                                        icon,
                                                        resetOnClose = false,
                                                        buttonIcon = false,
                                                        open: controlledOpen,
                                                        onOpenChange,
                                                    }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (open: boolean) => {
        onOpenChange?.(open);
        if (!isControlled) {
            setInternalOpen(open);
        }

        if (resetOnClose && !open) {
            resetState();
        }
    };

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Validazione file
    const validateFile = (file: File): string | null => {
        // Controllo dimensione
        if (file.size > maxFileSize * 1024 * 1024) {
            return `Il file è troppo grande. Dimensione massima: ${maxFileSize}MB`;
        }

        // Controllo tipo (se specificato)
        if (acceptedFileTypes !== '*') {
            const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim());
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const mimeType = file.type;

            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type.toLowerCase();
                }
                return mimeType.match(type.replace('*', '.*'));
            });

            if (!isAccepted) {
                return `Tipo di file non supportato. Tipi accettati: ${acceptedFileTypes}`;
            }
        }

        return null;
    };

    // Gestione selezione file
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setUploadStatus('error');
            setUploadMessage(validationError);
            return;
        }

        setSelectedFile(file);
        setUploadStatus('idle');
        setUploadMessage('');
    };

    // Upload file
    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadStatus('uploading');
        setProgress(null);
        abortControllerRef.current = new AbortController();

        try {
            // 1. Ottieni il presigned URL dalla server action
            const { presignedUrl, publicUrl } = await getUploadPresignedUrl(
                selectedFile.name,
                selectedFile.type
            );

            // 2. Upload via XMLHttpRequest per tracciare il progress
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                // Gestione progresso
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progressData: UploadProgress = {
                            loaded: event.loaded,
                            total: event.total,
                            percentage: (event.loaded / event.total) * 100
                        };
                        setProgress(progressData);
                        onUploadProgress?.(progressData, selectedFile);
                    }
                };

                // Gestione completamento
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Errore durante l'upload: ${xhr.statusText}`));
                    }
                };

                // Gestione errori di rete
                xhr.onerror = () => reject(new Error('Errore di rete durante l\'upload'));
                
                // Gestione abort
                xhr.onabort = () => reject(new DOMException('Upload annullato', 'AbortError'));

                // Collega il segnale di abort
                abortControllerRef.current?.signal.addEventListener('abort', () => xhr.abort());

                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', selectedFile.type);
                xhr.send(selectedFile);
            });

            // 3. Successo
            setUploadStatus('success');
            setUploadMessage('File caricato con successo!');
            onUploadSuccess?.(publicUrl, selectedFile);

            // Chiudi il modal dopo 2 secondi
            setTimeout(() => {
                handleOpenChange(false);
            }, 2000);

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'upload';

            if (error instanceof Error && error.name === 'AbortError') {
                setUploadStatus('error');
                setUploadMessage('Upload annullato');
            } else {
                setUploadStatus('error');
                setUploadMessage(errorMessage);
                onUploadError?.(errorMessage, selectedFile);
            }
        } finally {
            setUploading(false);
        }
    };

    // Annulla upload
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        resetState();
    };

    // Reset stato
    const resetState = () => {
        setSelectedFile(null);
        setProgress(null);
        setUploadStatus('idle');
        setUploadMessage('');
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Render icona status
    const renderStatusIcon = () => {
        switch (uploadStatus) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500"/>;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500"/>;
            case 'uploading':
                return <Upload className="h-5 w-5 text-blue-500 animate-pulse"/>;
            default:
                return null;
        }
    };

    // Gestione drag and drop
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Solo se stiamo uscendo dal componente principale
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const validationError = validateFile(file);
            if (validationError) {
                setUploadStatus('error');
                setUploadMessage(validationError);
                return;
            }

            setSelectedFile(file);
            setUploadStatus('idle');
            setUploadMessage('');
        }
    }, [maxFileSize, acceptedFileTypes]);

    // Gestione click per aprire file picker
    const handleDropAreaClick = () => {
        if (!uploading && !selectedFile) {
            fileInputRef.current?.click();
        }
    };

    return (
        <>
            {/* Animazione custom per il modal */}
            <style>
                {`
          .custom-dialog-zoom-fade {
            animation: zoomFadeIn 0.18s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes zoomFadeIn {
            0% {
              opacity: 0;
              transform: scale(0.92);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
            </style>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                {/*<DialogTrigger asChild>*/}
                {/*    <Button*/}
                {/*        //@ts-ignore*/}
                {/*        variant={buttonVariant}*/}
                {/*        //@ts-ignore*/}
                {/*        size={buttonSize}*/}
                {/*        className={buttonClassName}*/}
                {/*        disabled={disabled}*/}
                {/*    >*/}
                {/*        {icon || <Upload className="h-4 w-4"/>}*/}
                {/*        {!buttonIcon && buttonText}*/}
                {/*    </Button>*/}
                {/*</DialogTrigger>*/}

                <DialogContent className="sm:max-w-2xl bg-card border border-border custom-dialog-zoom-fade">
                    <DialogHeader>
                        <DialogTitle className="text-card-foreground">{modalTitle}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {modalDescription}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Grande area drag and drop */}
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={handleDropAreaClick}
                            className={`
                relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-in-out min-h-[300px] flex flex-col items-center justify-center
                ${isDragOver
                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                : uploadStatus === 'error'
                                    ? 'border-destructive bg-destructive/5'
                                    : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                            }
                ${uploading ? 'pointer-events-none opacity-75' : ''}
              `}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptedFileTypes}
                                multiple={multiple}
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={uploading}
                            />

                            {/* Icona centrale animata */}
                            <div className={`
                mb-6 p-6 rounded-full transition-all duration-300
                ${isDragOver
                                ? 'bg-primary/20 scale-110'
                                : uploadStatus === 'uploading'
                                    ? 'bg-primary/20 animate-pulse'
                                    : uploadStatus === 'success'
                                        ? 'bg-green-500/20'
                                        : uploadStatus === 'error'
                                            ? 'bg-destructive/20'
                                            : 'bg-muted'
                            }
              `}>
                                {uploadStatus === 'uploading' ? (
                                    <Upload className="h-12 w-12 text-primary animate-bounce"/>
                                ) : uploadStatus === 'success' ? (
                                    <CheckCircle className="h-12 w-12 text-green-500"/>
                                ) : uploadStatus === 'error' ? (
                                    <AlertCircle className="h-12 w-12 text-destructive"/>
                                ) : isDragOver ? (
                                    <Plus className="h-12 w-12 text-primary"/>
                                ) : (
                                    <Cloud className="h-12 w-12 text-muted-foreground"/>
                                )}
                            </div>

                            {/* Testo principale */}
                            <div className="space-y-3">
                                {selectedFile ? (
                                    <div className="space-y-2 flex flex-col items-center">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-semibold text-card-foreground">
                                                {selectedFile.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setUploadStatus('idle')
                                                setUploadMessage('')
                                                setProgress(null)
                                                setUploading(false)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ''
                                                }
                                            }}
                                            aria-label="Rimuovi file"
                                        >
                                            <X className="h-4 w-4"/>
                                            Rimuovi
                                        </Button>
                                    </div>
                                ) : isDragOver ? (
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-primary">
                                            Rilascia il file qui
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Il file verrà caricato automaticamente
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-card-foreground">
                                            Trascina e rilascia il file
                                        </h3>
                                        <p className="text-muted-foreground">
                                            oppure <span
                                            className="text-primary font-medium">clicca per selezionare</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Informazioni sui file accettati */}
                            <div className="mt-6 space-y-1 text-xs text-muted-foreground">
                                {acceptedFileTypes !== '*' && (
                                    <p>Tipi accettati: {acceptedFileTypes}</p>
                                )}
                                <p>Dimensione massima: {maxFileSize} MB</p>
                            </div>

                            {/* Overlay per drag state */}
                            {isDragOver && (
                                <div
                                    className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <div
                                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium">
                                        Rilascia qui per caricare
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress bar */}
                        {showProgress && progress && uploadStatus === 'uploading' && (
                            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-card-foreground font-medium">Caricamento in corso...</span>
                                    <span className="text-muted-foreground">{progress.percentage.toFixed(1)}%</span>
                                </div>
                                <Progress value={progress.percentage} className="w-full h-2"/>
                                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {(progress.loaded / 1024 / 1024).toFixed(2)} MB
                  </span>
                                    <span>
                    {(progress.total / 1024 / 1024).toFixed(2)} MB
                  </span>
                                </div>
                            </div>
                        )}

                        {/* Messaggio di stato */}
                        {uploadMessage && (
                            <div className={`p-4 rounded-lg border ${
                                uploadStatus === 'success'
                                    ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
                                    : uploadStatus === 'error'
                                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                                        : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                                <div className="flex items-center space-x-2">
                                    {uploadStatus === 'success' && <CheckCircle className="h-4 w-4"/>}
                                    {uploadStatus === 'error' && <AlertCircle className="h-4 w-4"/>}
                                    <p className="text-sm font-medium">{uploadMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* Pulsanti azione */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                            {uploading ? (
                                <Button variant="outline" onClick={handleCancel} className="text-card-foreground">
                                    <X className="h-4 w-4 mr-2"/>
                                    Annulla
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => handleOpenChange(false)}
                                            className="text-card-foreground">
                                        Chiudi
                                    </Button>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || uploadStatus === 'success'}
                                        className=""
                                    >
                                        <Upload className="h-4 w-4"/>
                                        Carica File
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UploadBox;

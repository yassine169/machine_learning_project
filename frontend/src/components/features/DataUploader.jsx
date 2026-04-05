import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadCloud, FileType } from 'lucide-react';

export default function DataUploader({ onUpload }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
        }
    };

    const handleFileSelected = (f) => {
        if (f.name.endsWith('.csv')) {
            setFile(f);
        } else {
            alert('Veuillez uploader un fichier CSV.');
        }
    };

    const confirmUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-primary" />
                    Importer le Dataset
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-border bg-background/50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="flex flex-col items-center gap-4">
                            <FileType className="w-12 h-12 text-primary opacity-80" />
                            <div>
                                <p className="font-semibold text-foreground">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setFile(null)}>Annuler</Button>
                                <Button size="sm" onClick={confirmUpload}>Traiter les données</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <UploadCloud className="w-12 h-12 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">Glissez-déposez votre fichier CSV ici, ou cliquez pour sélectionner</p>
                            <input
                                type="file"
                                accept=".csv"
                                id="file-upload"
                                className="hidden"
                                onChange={handleChange}
                            />
                            <Button variant="secondary" onClick={() => document.getElementById('file-upload').click()}>
                                Parcourir
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

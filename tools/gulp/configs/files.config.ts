export type FileConfig = {
    name: string;
    glob: string;
    destPath: string;
    options?: any;
};

export const schematicsFilesList: FileConfig[] = [
    { 
        name: 'package:json',
        glob: 'package.json',
        destPath: ''
    },
    {
        name: 'collection:json',
        glob: 'collection.json',
        destPath: '',
    },
    {
        name: 'application:template:files',
        glob: 'application/files/**/*',
        destPath: '/application/files',
        options: { dot: true },
    },
    {
        name: 'application:schema',
        glob: 'application/schema.json',
        destPath: '/application'
    }
];

export const schematicsFiles: string[] = schematicsFilesList.map(({ name }: FileConfig): string => name);
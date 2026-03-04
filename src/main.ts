import { rename } from 'node:fs/promises';
import { basename, extname, dirname, join } from 'node:path';
import { DefaultArtifactClient } from '@actions/artifact';

const artifactClient = new DefaultArtifactClient();

async function uploadSingleFileArtifact(file: string) {
  console.log(`Uploading ${file}...`);
  const { id, size } = await artifactClient.uploadArtifact(file, [file], './', { skipArchive: true });
  if (!id) throw new Error('')
  console.log(`Uploaded artifact ${file} with size ${size} bytes`);
  return { id, size };
}

export async function uploadMultipleFiles(files: string[], ensureUniqueness: boolean) {
  const output: Record<string, number> = {};

  async function processFile(file: string) {
    try {
      const ext = extname(file);
      const artifactName = ensureUniqueness ? join(dirname(file), `${basename(file, ext)}-${Date.now()}${ext}`) : file;
      // Rename to unique filename for upload
      // Necessary because `uploadArtifact()` ignores the provided artifact name
      // when `skipArchive` is true, and instead uses the filename
      if (ensureUniqueness) await rename(file, artifactName);

      const { id } = await uploadSingleFileArtifact(artifactName);
      output[file] = id;

      // Rename it back afterwards
      if (ensureUniqueness) await rename(artifactName, file);
    } catch (err) {
      console.error(`Could not upload file: ${file}`, err);
    }
  }

  await Promise.all(files.map(processFile));

  return output;
}
